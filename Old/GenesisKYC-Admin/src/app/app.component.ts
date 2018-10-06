import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {CustomerService} from './customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GenesisKYC Admin';

  constructor(private router: Router, private customerService: CustomerService) {
  }

  ngOnInit() {
    if (!this.customerService.selectedCustomer) {
      this.router.navigate(['/customers']);
    }
  }
}
