import {Component, OnInit} from '@angular/core';
import {BankTransaction} from '../models/bank-transaction';
import {CustomerService} from '../customer.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-customer-transaction-modal',
  templateUrl: './customer-transaction-modal.component.html',
  styleUrls: ['./customer-transaction-modal.component.css']
})
export class CustomerTransactionModalComponent implements OnInit {
  bankTransaction: BankTransaction;

  constructor(private customerService: CustomerService, public dialogRef: MatDialogRef<CustomerTransactionModalComponent>) {
    this.bankTransaction = new BankTransaction();
  }

  onSubmit() {
    const component = this;
    this.customerService.addCustomerTransaction(this.bankTransaction, this.customerService.selectedCustomer)
      .subscribe(function (response) {
        component.dialogRef.close();
      });
  }

  ngOnInit() {
  }

}
