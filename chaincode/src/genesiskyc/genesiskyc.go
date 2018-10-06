package genesiskyc

import "fmt"

// AssetType : Type of the structure for unmarshalling
type AssetType uint8

// CustomerType : Enumeration for the customer type
type CustomerType uint8

const (
	// Individual : Customer type individual
	Individual CustomerType = 1
	// Business : Customer type business
	Business CustomerType = 2
)

// AccountType : Enumeration for the bank account type
type AccountType uint8

const (
	// Savings : Savings account type
	Savings AccountType = 1
	// Checkings : Checkings account type
	Checkings AccountType = 2
	// Loan : Loan account type
	Loan AccountType = 3
)

// KYCStatus : Enumeration for the KYC status
type KYCStatus uint8

const (
	//StatusNew : New KYC
	StatusNew = 1
	//StatusUpdated : KYC information update
	StatusUpdated = 2
	//StatusVerified : KYC information verified
	StatusVerified = 3
	//StatusIssue : Issue with KYC
	StatusIssue = 4
	//StatusMore : More information is requested in KYC
	StatusMore = 5
)

// Name : Structure for name of the individual
type Name struct {
	FirstName  string
	MiddleName string
	LastName   string
	Suffix     string
}

func (name Name) ToString() string {
	var result string
	if name.FirstName {
		result += name.FirstName
	}
	if name.MiddleName {
		result += " " + name.MiddleName
	}
	if name.LastName {
		result += " " + name.LastName
	}
	if name.Suffix {
		result += " " + name.Suffix
	}
	return Trim(result)
}

// Asset : Base struct for all asset type
type Asset interface{}

// Identity : Base struct for customer identity
type Identity interface {
}

// IndividualIdentity : Identity details for individual customer
type IndividualIdentity struct {
	Identity
	SSN               string
	Name              Name
	PreviousNames     map[int]Name
	FatherName        Name
	MotherName        Name
	DateOfBirth       uint64
	Gender            string
	MaritalStatus     string
	Citizenship       string
	OtherCitizenship  map[int]string
	ResidentialStatus string
	Occuptation       string
}

// BusinessIdentity : Identity details of the corporation
type BusinessIdentity struct {
	Identity
	Name               string
	Type               string
	PreviousNames      map[int]string
	DateOfEstablish    uint64
	BusinessNature     string
	RegistrationNo     string
	RegistrationExpiry uint64
	BusinessType       map[int]string
}

// Address : Address of the customer
type Address struct {
	ID             uint
	CareOf         string
	Street1        string
	Street2        string
	City           string
	County         string
	State          string
	Country        string
	Zip            string
	Current        bool
	Correspondance bool
	Deleted        bool `json:"-"`
}

// Contact : Contact information of the customer
type Contact struct {
	Email       string
	MobilePhone string
	OfficePhone string
	Website     string
	Preferred   string
}

// RelatedKYC : Related KYC information of the customer
type RelatedKYC struct {
	ID           uint
	RelationType string
	CustomerID   string
	Deleted      bool `json:"-"`
}

// Employment : Current employment and work history of the customer
type Employment struct {
	ID          int
	Type        string
	CompanyName string
	Street1     string
	Street2     string
	City        string
	State       string
	Country     string
	Zip         string
	Designation string
	StartDate   uint64
	EndDate     uint64
	IsCurrent   bool
	GrossSalary int
	Deleted     bool `json:"-"`
}

// Account : Bank accounts (Savings, Checkings, Loan) accounts owned by the customer
type Account struct {
	ID        string
	Type      int
	BankName  string
	AccountNo string
	Closed    bool
	Deleted   bool `json:"-"`
}

// Document : Stores metadata of the documents, documents are stored in IPFS
type Document struct {
	ID          string
	Type        string
	Description string
	Deleted     bool `json:"-"`
}

// Access : Store the access information of customer
type Access struct {
	MSPID   string
	Created uint64
}

// Customer : Structure to hold customer information
type Customer struct {
	Asset
	ID                 string             // Unique ID for customer
	MspID              string             // Membership Service Provider ID
	CustomerType       CustomerType       // Customer Type
	IndividualIdentity IndividualIdentity // Individual identity information
	BusinessIdentity   BusinessIdentity   // Business Identity information
	Addresses          map[int]Address    // Address of customer
	Contact            Contact            // Contact information of the customer
	Related            map[int]RelatedKYC // Related people (parents in case of minors, owners for corporate)
	Remarks            string             // Remarks from customer
	Employments        map[int]Employment // Employment History
	Accounts           map[int]Account    // Accounts of the Customer
	Documents          map[int]Document   // Customer Documents (only identifiers)
	Meta               map[string]string  // Meta like like Auto Increment values
	Status             string             // Customer verification status
	StatusComment      string             // Status comment for this status
	Created            uint64             // Created time of customer
	Updated            uint64             // Last update time of customer
	StructType         string             // Structure Type
}

func (customer Customer) GetMeta(metaKey string) string {
	if customer.Meta != nil {
		return nil
	}
	return customer.Meta[metaKey]
}

func (customer Customer) SetMeta(metaKey string, metaValue string) {
	if customer.Meta == nil {
		customer.Meta = make(map[string]string)
	}
	customer.Meta[metaKey] = metaValue
}

// CustomerBasic : The basic information of customer for public collection
type CustomerBasic struct {
	ID           string         // Unique ID for customer
	MspID        string         // Membership Service Provider ID
	CustomerType CustomerType   // Customer Type
	Name         name           // Name of the customer
	Email        string         // Email address of the customer
	Accesses     map[int]Access // List of MSPID having access to this customer
	StructType   string         // Structure Type
}

type CustomerBasicJson struct {
	ID           string       // Unique ID for customer
	CustomerType CustomerType // Customer Type
	Name         name         // Name of the customer
	Email        string       // Email address of the customer
}

type CustomerJson struct {
	ID                 string             // Unique ID for customer
	CustomerType       CustomerType       // Customer Type
	IndividualIdentity IndividualIdentity // Individual identity information
	BusinessIdentity   BusinessIdentity   // Business Identity information
	Addresses          map[int]Address    // Address of customer
	Contact            Contact            // Contact information of the customer
	Related            map[int]RelatedKYC // Related people (parents in case of minors, owners for corporate)
	Remarks            string             // Remarks from customer
	Employments        map[int]Employment // Employment History
	Accounts           map[int]Account    // Accounts of the Customer
	Documents          map[int]Document   // Customer Documents (only identifiers)
	Status             string             // Customer verification status
	StatusComment      string             // Status comment for this status
	Created            uint64             // Created time of customer
	Updated            uint64             // Last update time of customer
}

// Transaction : Store transactions performed by the customer's bank account
type Transaction struct {
	Asset
	ID          string
	CustomerID  string
	AccountID   int
	Created     uint64
	Type        string
	Description string
	Amount      float64
	Flagged     bool   // default false
	StructType  string // Structure Type
}
