import {Component, Input, OnInit} from '@angular/core';
import {BankAccount} from '../models/bank-account';
import {CustomerService} from '../customer.service';

@Component({
  selector: 'app-profile-bank-account',
  templateUrl: './profile-bank-account.component.html',
  styleUrls: ['./profile-bank-account.component.css']
})
export class ProfileBankAccountComponent implements OnInit {
  bankAccounts: Array<BankAccount>;
  message: string;
  requesting = false;

  constructor(private customerService: CustomerService) {
    this.bankAccounts = customerService.bankAccounts;
  }

  ngOnInit() {
  }

  onAddNewClick() {
    let bankAccount: BankAccount;

    for (bankAccount of this.bankAccounts) {
      bankAccount.open = false;
    }

    bankAccount = new BankAccount();
    bankAccount.open = true;
    this.bankAccounts.push(bankAccount);
  }

  onRemoveClick($event, bankAccount: BankAccount) {
    $event.stopPropagation();
    bankAccount.deleted = true;
  }

  getAccountTypes() {
    return BankAccount.accountTypes;
  }

  save() {
    const component = this;
    this.requesting = true;
    this.customerService.updateCustomer('BankAccounts', this.bankAccounts)
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
