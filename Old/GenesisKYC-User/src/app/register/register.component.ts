import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../customer.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorMessage = null;
  registered = false;

  registerInfo = {};

  constructor(private customerService: CustomerService, private router: Router) {
  }

  onSubmit() {
    const component = this;
    this.customerService.register(this.registerInfo)
      .subscribe(function (response: any) {
        console.log(response);
        if (response.status === 200) {
          component.router.navigate(['registered']);
        } else {
          component.errorMessage = response.error;
        }
      });
  }

  ngOnInit() {
  }

}
