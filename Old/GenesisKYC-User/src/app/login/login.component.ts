import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CustomerService} from '../customer.service';
import {Router} from '@angular/router';
import {Customer} from '../models/customer';
import {BasicInfo} from '../models/basicInfo';
import {Address} from '../models/address';
import {Contact} from '../models/contact';
import {Employment} from '../models/employment';
import {BankAccount} from '../models/bank-account';
import {Document} from '../models/document';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() onLoggedIn: EventEmitter<Customer> = new EventEmitter<Customer>();

  errorMessage = null;

  loginInfo = {};

  constructor(private customerService: CustomerService, private router: Router) {
  }

  onSubmit() {
    const component = this;
    this.customerService.login(this.loginInfo).subscribe(function(response: any) {
      if (response.status === 200) {
        // Read customer data from the blockchain
        component.customerService.queryCustomer()
          .subscribe(function () {
            component.router.navigate(['profile']);
          });
      } else {
        component.errorMessage = response.error;
      }
    });
  }

  ngOnInit() {
  }
}
