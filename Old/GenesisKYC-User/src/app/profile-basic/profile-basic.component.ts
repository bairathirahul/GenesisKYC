import {Component, OnInit, Input} from '@angular/core';
import {BasicInfo} from '../models/basicInfo';
import {CustomerService} from '../customer.service';

@Component({
  selector: 'app-profile-basic',
  templateUrl: './profile-basic.component.html',
  styleUrls: ['./profile-basic.component.css']
})
export class ProfileBasicComponent implements OnInit {
  basicInfo: BasicInfo;
  message: string;
  requesting = false;

  constructor(public customerService: CustomerService) {
    this.basicInfo = customerService.basicInfo;
  }

  ngOnInit() {
  }

  getSalutations() {
    return BasicInfo.salutations;
  }

  getGenders() {
    return BasicInfo.genders;
  }

  getTypes() {
    return BasicInfo.types;
  }

  save() {
    const component = this;
    this.requesting = true;

    this.customerService.searchCustomers(this.basicInfo.ssn)
      .subscribe(function (response: any) {
        if (response.result !== null) {
          response.result = JSON.parse(response.result);

          for (const customer of response.result) {
            if (customer.ID !== component.customerService.customer.id.toString()) {
              component.requesting = false;
              component.message = 'Error! duplicate account detected';
              return;
            }
          }
        }

        if (response.result == null || response.result.length < 2) {
          component.customerService.updateCustomer('BasicInfo', component.basicInfo)
            .subscribe(function (response: any) {
              component.requesting = false;
              if (response.returnCode === 'Success') {
                component.message = 'Information saved successfully';
              } else {
                component.message = response.info;
              }
            });
        }
      });
  }
}
