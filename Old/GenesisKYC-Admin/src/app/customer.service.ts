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
import {map} from 'rxjs/operators';
import {BankTransaction} from './models/bank-transaction';

@Injectable()
export class CustomerService {

  customers: Array<Customer>;
  selectedCustomer: Customer;

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
    method: null,
    args: null
  };

  constructor(private http: HttpClient) {
  }

  searchPendingCustomers() {
    const service = this;
    const params = {...this.obcParams};
    params.method = 'searchPendingCustomer';
    params.args = [];
    params.url = environment.queryURL;
    delete this.customers;
    return this.http.post(environment.serviceURL + 'proxy', params, this.httpOptions)
      .pipe(map(function (response: any) {
          service.customers = Array<Customer>();
          if (response.returnCode === 'Success') {
            if (response.result == null || response.result.length === 0) {
              return Array<Customer>();
            }

            const data = JSON.parse(response.result);
            for (const entry of data) {
              const customer = new Customer();
              customer.id = parseInt(entry.ID, 10);
              customer.basicInfo = BasicInfo.convert(entry.BasicInfo);
              customer.addresses = Address.convert(entry.Addresses);
              customer.contact = Contact.convert(entry.Contact);
              customer.bankAccounts = BankAccount.convert(entry.BankAccounts);
              customer.employments = Employment.convert(entry.Employments);
              customer.documents = Document.convert(entry.Documents);
              customer.bankTransactions = BankTransaction.convert(entry.BankTransactions);
              customer.accesses = entry.Accesses;
              if (customer.accesses === null) {
                customer.accesses = {};
              }
              customer.status = entry.Status;
              service.customers.push(customer);
            }
          }
          return response;
        }
      ));
  }

  updateCustomerStatus(customer, status, comment) {
    const service = this;
    const params = {...this.obcParams};
    params.method = 'updateCustomerStatus';
    params.args = [customer.id.toString(), status, comment];
    params.url = environment.updateURL;
    return this.http.post(environment.serviceURL + 'proxy', params, this.httpOptions)
      .pipe(map(function (response: any) {
          if (response.returnCode === 'Success') {
            customer.status = status;
          }
          return response;
        }
      ));
  }

  getCustomers() {
    return this.customers;
  }

  getDocumentUrl(documentID, customer_id) {
    return environment.serviceURL + 'read?id=' + documentID + '&customer_id=' + customer_id;
  }
}
