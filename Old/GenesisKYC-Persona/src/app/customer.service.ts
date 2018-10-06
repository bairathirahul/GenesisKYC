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

  searchCustomers(query) {
    const service = this;
    const params = {...this.obcParams};
    params.method = 'searchCustomer';
    params.args = [query];
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
              customer.rating = entry.Rating;
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

  requestCustomer(customer) {
    const service = this;
    const params = {...this.obcParams};
    params.method = 'requestCustomerAccess';
    params.args = [customer.id.toString(), environment.persona];
    params.url = environment.updateURL;
    return this.http.post(environment.serviceURL + 'proxy', params, this.httpOptions)
      .subscribe(function (response: any) {
          if (response.returnCode === 'Success') {
            customer.accesses[environment.persona] = false;
          }
          return response;
        }
      );
  }

  addCustomerTransaction(bankTransaction, customer) {
    const service = this;
    const params = {...this.obcParams};
    params.method = 'insertCustomerTransaction';
    params.args = [customer.id.toString(), JSON.stringify(bankTransaction, function (key, value) {
      if (key === 'transactionDate') {
        return new Date(value).getTime();
      }
      return value;
    })];
    params.url = environment.updateURL;
    return this.http.post(environment.serviceURL + 'proxy', params, this.httpOptions)
      .pipe(map(function (response: any) {
          if (response.returnCode === 'Success') {
            service.selectedCustomer.bankTransactions.push(bankTransaction);
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
