import {Component, Input, OnInit} from '@angular/core';
import {Contact} from '../models/contact';
import {CustomerService} from '../customer.service';

@Component({
  selector: 'app-profile-contact',
  templateUrl: './profile-contact.component.html',
  styleUrls: ['./profile-contact.component.css']
})
export class ProfileContactComponent implements OnInit {
  contact: Contact;
  message: string;
  requesting = false;

  constructor(private customerService: CustomerService) {
    this.contact = customerService.contact;
  }

  ngOnInit() {
  }

  getPrimaryContacts() {
    return Contact.primaryContacts;
  }

  save() {
    const component = this;
    this.requesting = true;
    this.customerService.updateCustomer('Contact', this.contact)
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
