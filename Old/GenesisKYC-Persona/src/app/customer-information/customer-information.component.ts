import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../customer.service';
import {Customer} from '../models/customer';
import {Address} from '../models/address';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.css']
})
export class CustomerInformationComponent implements OnInit {
  customer: Customer;

  constructor(private customerService: CustomerService) {
    this.customer = this.customerService.selectedCustomer;
  }

  ngOnInit() {
  }

  getState(abbreviation) {
    for (const state of Address.states) {
      if (state.abbreviation === abbreviation) {
        return state.name;
      }
    }
  }
}
