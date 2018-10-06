package genesiskyc

import (
	"encoding/json"
	"errors"
	"fmt"
	"reflect"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/lib/cid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

var (
	Trace   *log.Logger
	Info    *log.Logger
	Warning *log.Logger
	Error   *log.Logger
)

// logger : Improved logger interface
var logger Logger

// Chaincode : struct declaration
type Chaincode struct {
	identity cid.ClientIdentity
}

// Init : Initializes the chaincode, nothing to do here
func (sc *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	// Initialize the logger with log level
	args := stub.GetArgs()
	if len(args) > 0 {
		logger = InitLogger(args[0])
	} else {
		logger = InitLogger("INFO")
	}
	return shim.Success(nil)
}

// Invoke must be called with the "invoke" method of the chaincode. The
// parameters should be [methodName, arg1, arg2, ...]
func (sc *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	function, args := stub.GetFunctionAndParameters()
	logger.Debug("Function: %s", function)
	logger.Debug("Args: %s", args)

	var err error

	// Read caller identity
	sc.identity, err = cid.New(stub)
	if err != nil {
		// Call identity cannot be determined
		return shim.Error(fmt.Sprintf(errorChaincodeCaller))
	}

	// Read method using reflection
	method := reflect.ValueOf(&sc).MethodByName(function)
	if !reflect.Value.IsValid(method) {
		// Method does not exist
		return shim.Error(fmt.Sprintf(errorChaincodeMethod, function))
	}

	// Call method
	result := method.Call([]reflect.Value{reflect.ValueOf(stub), reflect.ValueOf(args)})
	response := result[0].Interface().(peer.Response)
	return response
}

// create : Create a customer
func (sc *Chaincode) create(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if stub.GetState(sc.identity.GetID()) != nil {
		logger.Error(errorCustomerExists)
		return shim.Error(errorCustomerExists)
	}

	// Unmarshal request parameters
	var request map[string]*jsonRawMessage
	err = json.Unmarshal(args[1], &request)
	if err != nil {
		return shim.Error(fmt.Printf(errorRequestMalformed))
	}

	// Initialize the customer object
	customer := Customer{}
	customer.ID = sc.identity.GetID()
	customer.MspID = sc.identity.GetMSPID()
	customer.CustomerType = request["customerType"]
	customer.Contact = Contact{Email: request["email"]}
	if customer.CustomerType == Individual {
		customerName := Name{FirstName: request["firstName"], MiddleName: request["middleName"], LastName: request["lastName"]}
		customer.IndividualIdentity = IndividualIdentity{Name: customerName}
	} else {
		customerName := request["Name"]
		customer.BusinessIdentity = BusinessIdentity{Name: request["Name"]}
	}
	customer.StructType = reflect.TypeOf(customer).Name()
	customer.Created = time.Now()
	customer.Updated = time.Now()
	// Todo generate encryption key

	// Initialize the customer's basic information
	customerBasic := CustomerBasic{}
	customerBasic.ID = customer.ID
	customerBasic.MspID = customer.ID
	customerBasic.CustomerType = customer.CustomerType
	if customer.CustomerType == Individual {
		customerBasic.Name = customerName.ToString()
	} else {
		customerBasic.Name = customerName
	}
	customerBasic.Name = customer.Identity.Name
	customerBasic.Email = customer.Contact.Email
	customerBasic.Access = []Access{Access{customerBasic.MspID, time.Now()}}
	customerBasic.StructType = reflect.TypeOf(customerBasic).Name()

	// Save the customer
	logger.Info("Saving customer %s", customer.ID)
	customerBytes, _ := json.Marshal(customer)
	err = stub.PutPrivateData(customer.MspID, customer.ID, customerBytes)
	if err != nil {
		logger.Error(err.Error())
		return shim.Error(err.Error())
	}

	// Save the customerBasic
	customerBasicBytes, _ := json.Marshal(customerBasic)
	err = stub.PutState(customerBasic.ID, customerBasicBytes)
	if err != nil {
		logger.Error(err.Error())
		return shim.Error(err.Error())
	}

	// Return success
	return shim.Success(customerBytes)
}

func (sc *Chaincode) readCustomerBasic(id string) (CustomerBasic, Error) {
	// Read customer's Basic information
	var customerBasicBytes []byte
	customerBasicBytes, err = stub.getState(id)
	if err != nil {
		return nil, err
	}
	if len(customerBasicBytes) == 0 {
		return nil, errors.New(fmt.Printf(errorCustomerNotFound, args[0]))
	}

	// Unmarshal customer's basic information
	var customerBasic CustomerBasic
	err = json.Unmarshal(customerBasicBytes, &customerBasic)
	if err != nil {
		return nil, err
	}
	return customerBasic, nil
}

func (sc *Chaincode) readCustomer(id string, collection string) (Customer, Error) {
	// Read customer's information
	var customerBytes []byte
	customerBytes, err = stub.getPrivateData(collection, id)
	if err != nil {
		return nil, err
	}
	if len(customerBasicBytes) == 0 {
		return nil, errors.New(fmt.Printf(errorCustomerNotFound, args[0]))
	}

	// Read customers from private collection
	var customer Customer
	err = json.Unmarshal(customerBytes, &customer)
	if err != nil {
		return nil, err
	}
	return customer, nil
}

// update : Update the information of customer (must be called by the customer only)
func (sc *Chaincode) update(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	var err error
	var customerBasic CustomerBasic
	var customer Customer

	logger.Info(fmt.Printf("Reading customer information for %d", args[0]))
	customerBasic, err = sc.readCustomerBasic(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}

	// Check authorization
	if customerBasic.MspID != sc.identity.GetMSPID() {
		return shim.Error(fmt.Println(errorCustomerAuth))
	}

	customer, err = sc.readCustomer(customerBasic.MspID, collection)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Unmarshal updates to the customer information
	var request map[string]*json.RawMessage
	err = json.Unmarshal(args[1], &customerUpdates)
	if err != nil {
		return shim.Error(fmt.Printf(errorRequestMalformed))
	}
	putBasic := false

	for key, value := range customerUpdates {
		switch key {
		case "individualIdentity":
			if customerBasic.CustomerType != Individual {
				return shim.Error(fmt.Printf(errorRequestMalformed))
			}

			var identity IndividualIdentity
			err = json.Unmarshal(request[key], identity)
			if err != nil {
				return shim.Error(fmt.Printf(errorRequestMalformed))
			}
			customer.IndividualIdentity = identity
			customerBasic.Name = identity.Name.ToString()
			putBasic = true
		case "businessIdentity":
			if customerBasic.CustomerType != Business {
				return shim.Error(fmt.Printf(errorRequestMalformed))
			}

			var identity BusinessIdentity
			err = json.Unmarshal(request[key], identity)
			if err != nil {
				return shim.Error(fmt.Printf(errorRequestMalformed))
			}
			customer.BusinessIdentity = identity
			customerBasic.Name = identity.Name
			putBasic = true
		case "addresses":
			var addresses []Address
			err = json.Unmarshal(request[key], addresses)
			if err != nil {
				return shim.Error(fmt.Printf(errorRequestMalformed))
			}

			// Initializes address structure
			if customer.Addresses == nil {
				customer.Addresses = map[int]Address{}
			}
			for _, address := range addresses {
				if address.Deleted == true {
					_, ok := customer.Addresses[address.ID]
					if ok {
						delete(customer.Addresses, address.ID)
					}
				} else {
					if address.ID == nil {
						id := strconv.Atoi(customer.GetMeta("SequenceAddress")) + 1
						address.ID = id
					}
					customer.Addresses[address.ID] = address
				}
			}

		case "contact":
			var contact Contact
			err = json.Unmarshal(request[key], contact)
			if err != nil {
				return shim.Error(fmt.Printf(errorRequestMalformed))
			}
			customer.Contact = contact
		case "employments":
			var employments []Address
			err = json.Unmarshal(request[key], employments)
			if err != nil {
				return shim.Error(fmt.Printf(errorRequestMalformed))
			}
			// Initializes employment structure
			if customer.Addresses == nil {
				customer.Addresses = map[int]Address{}
			}

			for _, employment := range employments {
				if employment.Deleted == true {
					_, ok := customer.Addresses[employment.ID]
					if ok {
						delete(customer.Addresses, employment.ID)
					}
				} else {
					if employment.ID == nil {
						id := strconv.Atoi(customer.GetMeta("SequenceAddress")) + 1
						employment.ID = id
					}
					customer.Addresses[employment.ID] = employment
				}

			}
		case "accounts":
			var accounts []Address
			err = json.Unmarshal(request[key], accounts)
			if err != nil {
				return shim.Error(fmt.Printf(errorRequestMalformed))
			}
			// Initializes account structure
			if customer.Addresses == nil {
				customer.Addresses = map[int]Address{}
			}
			for _, account := range accounts {
				if account.Deleted == true {
					_, ok := customer.Addresses[account.ID]
					if ok {
						delete(customer.Addresses, account.ID)
					}
				} else {
					if account.ID == nil {
						id := strconv.Atoi(customer.GetMeta("SequenceAddress")) + 1
						account.ID = id
					}
					customer.Addresses[account.ID] = account
				}
			}
		case "documents":
			var documents []Address
			err = json.Unmarshal(request[key], documents)
			if err != nil {
				return shim.Error(fmt.Printf(errorRequestMalformed))
			}
			// Initializes document structure
			if customer.Addresses == nil {
				customer.Addresses = map[int]Address{}
			}
			for _, document := range documents {
				if document.Deleted == true {
					_, ok := customer.Addresses[document.ID]
					if ok {
						delete(customer.Addresses, document.ID)
					}
				} else {
					if document.ID == nil {
						id := strconv.Atoi(customer.GetMeta("SequenceAddress")) + 1
						document.ID = id
					}
					customer.Addresses[document.ID] = document
				}
			}
		default:
			return shim.Error(fmt.Printf(errorCustomerNoField, field))
		}
	}

	// Save the customer
	logger.Info("Saving customer %s", customer.ID)
	customer.Updated = time.Now()
	customerBytes, _ := json.Marshal(customer)
	for _, mspID := range customerBasic.Accesses {
		if mspID == customerBasic.MspID {
			collection := mspID
		} else {
			collection := customerBasic.MspID + "|" + mspID
		}
		err = stub.PutPrivateData(collection, customer.ID, customerBytes)
		if err != nil {
			logger.Error(err.Error())
			return shim.Error(err.Error())
		}
	}

	// Save the customerBasic
	if putBasic {
		customerBasicBytes, _ := json.Marshal(customerBasic)
		err = stub.PutState(customerBasic.ID, customerBasicBytes)
		if err != nil {
			logger.Error(err.Error())
			return shim.Error(err.Error())
		}
	}

	// Return success
	return shim.Success(customerBytes)
}

// status : Set status of the customer (must be called by the kyc or bank officials only)
func (sc *Chaincode) status(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	var err error
	var customerBasic CustomerBasic
	var customer Customer

	logger.Info(fmt.Printf("Reading customer information for %d", args[0]))
	customerBasic, err = sc.readCustomerBasic(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}

	// Check authorization
	if customerBasic.MspID != sc.identity.GetMSPID() {
		return shim.Error(fmt.Println(errorCustomerAuth))
	}

	// Todo Check role
	if sc.identity.GetAttributeValue("OU") != "Admin" {
		return shim.Error(fmt.Println(errorCustomerAuth))
	}

	customer, err = sc.readCustomer(customerBasic.MspID, collection)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Unmarshal updates to the customer information
	var request map[string]*json.RawMessage
	err = json.Unmarshal(args[1], &customerUpdates)
	if err != nil {
		return shim.Error(fmt.Printf(errorRequestMalformed))
	}

	customer.Status = request["status"]
	customer.StatusComment = request["statusComment"]

	// Save the customer
	logger.Info("Saving customer %s", customer.ID)
	customerBytes, _ := json.Marshal(customer)
	for _, mspID := range customerBasic.Accesses {
		if mspID == customerBasic.MspID {
			collection := mspID
		} else {
			collection := customerBasic.MspID + "|" + mspID
		}
		err = stub.PutPrivateData(collection, customer.ID, customerBytes)
		if err != nil {
			logger.Error(err.Error())
			return shim.Error(err.Error())
		}
	}

	// Return success
	return shim.Success(customerBytes)
}

// search : Search customer (can be called by anybody)
func (sc *Chaincode) search(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	queryString = "{\"selector\": {\"structType\": \"CustomerBasic\", \"$or\": [{\"name\": {\"$regex\":\".*%s.*\"}}, {\"email\":{\"$regex\":\".*%s.*\"}}]}}"
	queryString := fmt.Sprintf(queryString, args[0])

	customersBytes, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(customersBytes)
}

// request : Request access
func (sc *Chaincode) request(stub shim.ChaincodeStubInterface, args []string) peer.Response {
}

// query : Read the customer information
func (sc *Chaincode) query(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	var err error
	var customerBasic CustomerBasic
	var customer Customer

	logger.Info("Reading customer %s with access level %s", args[0], args[1])
	customerBasic, err = sc.readCustomerBasic(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}

	if args[1] == "basic" {
		customerBasicJson := CustomerBasicJson{customerBasic.ID, customerBasic.CustomerType, customerBasic.Name, customerBasic.Email}
		customerBasicBytes, _ := json.Marshal(customerBasicJson)
		return shim.Success(customerBasicBytes)
	}

	// Check authorization
	if customerBasic.MspID != sc.identity.GetMSPID() {
		return shim.Error(fmt.Println(errorCustomerAuth))
	}

	customer, err = sc.readCustomer(customerBasic.MspID, collection)
	if err != nil {
		return shim.Error(err.Error())
	}

	customerJson = CustomerJson{customer.ID, customer.IndividualIdentity, customer.BusinessIdentity, customer.Addresses, customer.Contact, customer.Remarks, customer.Related, customer.Employments, customer.Accounts, customer.Documents, customer.Status, customer.StatusComment, customer.Created, customer.Updated}
	customerBytes, _ := json.Marshal(customerJson)
	return shim.Success(customerBytes)
}
