import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../customer.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Document} from '../models/document';
import {Address} from '../models/address';
import {Customer} from '../models/customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer: Customer;
  action = {
    status: '',
    comment: ''
  };
  message: string;
  requesting = false;

  constructor(private customerService: CustomerService, private sanitizer: DomSanitizer) {
    this.customer = customerService.selectedCustomer;
    this.action.status = this.customer.status;
  }

  ngOnInit() {
  }

  getDocumentUrl(document: Document) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.customerService.getDocumentUrl(document.documentID, this.customer.id));
  }

  getState(abbreviation) {
    for (const state of Address.states) {
      if (state.abbreviation === abbreviation) {
        return state.name;
      }
    }
  }

  onSubmit() {
    const component = this;
    this.requesting = true;

    this.customerService.updateCustomerStatus(this.customer, this.action.status, this.action.comment)
      .subscribe(function (response) {
        component.requesting = false;
        component.message = 'Status updated';
      });
  }

}
