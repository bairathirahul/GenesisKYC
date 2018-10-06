package genesiskyc

import (
	"encoding/json"
)

// create : Create a customer
func (sc *Chaincode) create(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	// Initialize the customer object
	customer := Customer{StructType: TypeCustomer}
	customer.CustomerID = sc.identity.GetID()
	customer.MspID = sc.identity.GetMSPID()
	customer.CustomerType = args[0]
	customer.Contact = Contact{Email: args[1]}

	if customer.CustomerType == Individual {
		customerName := Name{FirstName: args[2], LastName: args[3]}
		customerIdentity := IndividualIdentity{Name: customerName}
	} else {
		customerIdentity := BusinessIdentity{Name: args[2]}
	}
	customer.Identity = customerIdentity

	customerBytes = json.Marshal(customer)
	

	// Update customer
	fmt.Println("CHAINCODE: Writing customer back to ledger")
	jsonAsBytes, _ := json.Marshal(customer)
	err = stub.PutState(customer.ID, jsonAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(jsonAsBytes)
}

// update : Update the information of customer (must be called by the customer only)
func (sc *Chaincode) update(stub shim.ChaincodeStubInterface, args []string) peer.Response {
}

// status : Set status of the customer (must be called by the kyc or bank officials only)
func (sc *Chaincode) status(stub shim.ChaincodeStubInterface, args []string) peer.Response {
}

// search : Search customer (can be called by anybody)
func (sc *Chaincode) search(stub shim.ChaincodeStubInterface, args []string) peer.Response {
}

// request : Request access
func (sc *Chaincode) request(stub shim.ChaincodeStubInterface, args []string) peer.Response {
}

// query : Read the customer information
func (sc *Chaincode) query(stub shim.ChaincodeStubInterface, args []string) peer.Response {

}

// StateUnMarshall : Unmarshall states
func StateUnMarshall(input []byte, assetType AssetType) Asset {
	switch assetType {
	case TypeCustomer:
		ref := Customer{}
	case TypeAccess:
		ref := Access{}
	case TypeTransaction:
		ref := Transaction
	}

	json.Unmarshal([]byte(args[2]), &ref)
	return ref
}

// StateMarshal : Marshal states
func StateMarshal(asset Asset) []byte {
	switch asset

}
