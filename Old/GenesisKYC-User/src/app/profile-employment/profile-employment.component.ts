import {Component, OnInit} from '@angular/core';
import {Employment} from '../models/employment';
import {Address} from '../models/address';
import {CustomerService} from '../customer.service';

@Component({
  selector: 'app-profile-employment',
  templateUrl: './profile-employment.component.html',
  styleUrls: ['./profile-employment.component.css']
})

export class ProfileEmploymentComponent implements OnInit {
  employments: Array<Employment>;
  message: string;
  requesting = false;

  constructor(private customerService: CustomerService) {
    this.employments = customerService.employments;
  }

  ngOnInit() {
  }

  onRemoveClick($event, employment: Employment) {
    $event.stopPropagation();
    employment.deleted = true;
  }

  onAddNewClick() {
    let employment: Employment;

    for (employment of this.employments) {
      employment.open = false;
    }

    employment = new Employment();
    employment.open = true;
    this.employments.push(employment);
  }

  getEmploymentTypes() {
    return Employment.employmentTypes;
  }

  getStates() {
    return Address.states;
  }

  save() {
    const component = this;
    this.requesting = true;
    this.customerService.updateCustomer('Employments', this.employments)
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
