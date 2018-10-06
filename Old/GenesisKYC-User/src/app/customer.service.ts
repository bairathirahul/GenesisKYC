import {Injectable} from '@angular/core';
import {Customer} from './models/customer';
import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BasicInfo} from './models/basicInfo';
import {Address} from './models/address';
import {Contact} from './models/contact';
import {Employment} from './models/employment';
import {BankAccount} from './models/bank-account';
import {Document} from './models/document';
import {Comment} from './models/comment';
import {map} from 'rxjs/operators';

@Injectable()
export class CustomerService {

  customer: Customer;
  basicInfo: BasicInfo;
  addresses: Array<Address>;
  contact: Contact;
  employments: Array<Employment>;
  bankAccounts: Array<BankAccount>;
  documents: Array<Document>;
  comments: Array<Comment>;
  accesses: {};
  status: string;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  obcParams = {
    url: null,
    channel: 'kycaccess',
    chaincode: 'genesiskyc',
    chaincodeVer: 'v1.2.8',
    method: 'updateCustomer',
    args: null
  };

  constructor(private http: HttpClient) {
  }

  autoLogin() {
    if (!this.customer && localStorage.getItem('customer') !== null) {
      this.customer = JSON.parse(localStorage.getItem('customer'));
    }
    if (this.customer) {
      return this.queryCustomer();
    }
    return false;
  }

  login(loginInfo) {
    const service = this;
    return this.http.post(environment.serviceURL + 'login', loginInfo, this.httpOptions)
      .pipe(map(function (response: any) {
        if (response.status === 200) {
          const customer = new Customer();
          customer.id = response.customer.id;
          customer.firstName = response.customer.firstName;
          customer.middleName = response.customer.middleName;
          customer.lastName = response.customer.lastName;
          customer.email = response.customer.email;
          customer.authToken = response.customer.authToken;
          customer.createdOn = response.customer.createdOn;
          service.setCustomer(customer);
        }
        return response;
      }));
  }

  register(registerInfo) {
    return this.http.post(environment.serviceURL + 'register', registerInfo, this.httpOptions);
  }

  upload(file) {
    const formData = new FormData();
    formData.append('customer_id', this.customer.id.toString());
    formData.append('file', file, file.name);
    return this.http.post(environment.serviceURL + 'upload', formData, {});
  }

  queryCustomer() {
    const service = this;
    const params = {...this.obcParams};
    params.method = 'queryCustomer';
    params.args = [this.customer.id.toString()];
    params.url = environment.queryURL;
    return this.http.post(environment.serviceURL + 'proxy', params, this.httpOptions)
      .pipe(map(function (response: any) {
        if (response.returnCode === 'Success') {
          if (response.result != null && response.result !== '') {
            const data = JSON.parse(response.result);
            service.basicInfo = BasicInfo.convert(data.BasicInfo);
            service.addresses = Address.convert(data.Addresses);
            service.contact = Contact.convert(data.Contact);
            service.bankAccounts = BankAccount.convert(data.BankAccounts);
            service.employments = Employment.convert(data.Employments);
            service.documents = Document.convert(data.Documents);
            service.comments = Comment.convert(data.Comments);
            service.accesses = data.Accesses;
            service.status = data.Status;
          } else {
            service.basicInfo = new BasicInfo();
            service.basicInfo.firstName = service.customer.firstName;
            service.basicInfo.middleName = service.customer.middleName;
            service.basicInfo.lastName = service.customer.lastName;
            service.addresses = Array<Address>();
            service.contact = new Contact();
            service.contact.emailAddress = service.customer.email;
            service.bankAccounts = Array<BankAccount>();
            service.employments = Array<Employment>();
            service.documents = Array<Document>();
            service.comments = Array<Comment>();
            service.status = 'New';
            service.accesses = {};
          }
        }
        return response;
      }));
  }

  updateCustomer(fieldName, data, json = true) {
    if (json) {
      data = JSON.stringify(data, function (key, value) {
        if (key === 'dateOfBirth' || key === 'startDate' || key === 'endDate' || key === 'created') {
          return new Date(value).getTime();
        }
        return value;
      });
    }

    const service = this;
    const params = {...this.obcParams};
    params.args = [fieldName, this.customer.id.toString(), data];
    params.url = environment.updateURL;
    console.log(params);

    return this.http.post(environment.serviceURL + 'proxy', params, this.httpOptions)
      .pipe(map(function (response: any) {
        if (response.returnCode === 'Success') {
          service.queryCustomer().subscribe();
        }
        return response;
      }));
  }

  searchCustomers(query) {
    const service = this;
    const params = {...this.obcParams};
    params.method = 'searchCustomer';
    params.args = [query];
    params.url = environment.queryURL;
    return this.http.post(environment.serviceURL + 'proxy', params, this.httpOptions);
  }

  approveRequest(persona) {
    const params = {...this.obcParams};
    params.method = 'approveCustomerAccess';
    params.args = [this.customer.id.toString(), persona];
    params.url = environment.updateURL;
    console.log(params);

    return this.http.post(environment.serviceURL + 'proxy', params, this.httpOptions);
  }

  logout() {
    delete this.customer;
    localStorage.removeItem('customer');
  }

  setCustomer(customer: Customer) {
    this.customer = customer;
    localStorage.setItem('customer', JSON.stringify(customer));
  }

  getCustomer() {
    return this.customer;
  }

  getDocumentUrl(documentID) {
    return environment.serviceURL + 'read?id=' + documentID + '&customer_id=' + this.customer.id;
  }
}
