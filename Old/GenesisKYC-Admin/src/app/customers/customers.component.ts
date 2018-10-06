import {Component, OnInit, Inject} from '@angular/core';
import {CustomerService} from '../customer.service';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  constructor(private router: Router, private service: CustomerService) {
    service.searchPendingCustomers().subscribe(function (response) {
      // do nothing
    });
  }

  ngOnInit() {
  }

  onCustomerClick($event, customer) {
    $event.preventDefault();

    const component = this;
    this.service.selectedCustomer = customer;
    this.router.navigate(['/customer', customer.id]);
  }

  getCustomerName(customer) {
    return [customer.basicInfo.firstName, customer.basicInfo.middleName, customer.basicInfo.lastName].join(' ');
  }

  getStatusIcon(customer) {
    if (customer.status === 'updated') {
      return 'warning';
    } else {
      return 'done';
    }
  }
}
