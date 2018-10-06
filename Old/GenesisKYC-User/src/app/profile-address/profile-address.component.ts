import {Component, Input, OnInit} from '@angular/core';
import {Address} from '../models/address';
import {CustomerService} from '../customer.service';

@Component({
  selector: 'app-profile-address',
  templateUrl: './profile-address.component.html',
  styleUrls: ['./profile-address.component.css']
})

export class ProfileAddressComponent implements OnInit {
  addresses: Array<Address>;
  message: string;
  requesting = false;

  constructor(private customerService: CustomerService) {
    this.addresses = customerService.addresses;
  }

  ngOnInit() {
  }

  onRemoveClick($event, address: Address) {
    $event.stopPropagation();
    address.deleted = true;
  }

  onAddNewClick() {
    const address = new Address();
    address.open = true;
    this.addresses.push(address);
  }

  getStates() {
    return Address.states;
  }

  save() {
    const component = this;
    this.requesting = true;
    this.customerService.updateCustomer('Addresses', this.addresses)
      .subscribe(function (response: any) {
        component.requesting = false;
        if (response.returnCode === 'Success') {
          component.message = 'Information saved successfully';
        } else {
          component.message = response.info;
        }
      });
  }
}
