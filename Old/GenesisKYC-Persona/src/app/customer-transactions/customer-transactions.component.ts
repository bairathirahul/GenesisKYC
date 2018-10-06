import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../customer.service';
import {Customer} from '../models/customer';
import {MatDialog} from '@angular/material';
import {CustomerTransactionModalComponent} from '../customer-transaction-modal/customer-transaction-modal.component';

@Component({
  selector: 'app-customer-transactions',
  templateUrl: './customer-transactions.component.html',
  styleUrls: ['./customer-transactions.component.css']
})
export class CustomerTransactionsComponent implements OnInit {

  customer: Customer;

  constructor(private customerService: CustomerService, private dialog: MatDialog) {
    this.customer = this.customerService.selectedCustomer;
  }

  onAddTransactionClick() {
    this.dialog.open(CustomerTransactionModalComponent);
  }

  ngOnInit() {
  }

}
