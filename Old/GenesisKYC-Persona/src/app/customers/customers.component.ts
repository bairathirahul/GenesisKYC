import {Component, OnInit, Inject} from '@angular/core';
import {CustomerService} from '../customer.service';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  query = '';
  requesting = false;

  constructor(private router: Router, private service: CustomerService, private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.query) {
      const component = this;
      this.requesting = true;
      this.service.searchCustomers(this.query).subscribe(function () {
        component.requesting = false;
      });
    }
  }

  getCustomerName(customer) {
    return [customer.basicInfo.firstName, customer.basicInfo.middleName, customer.basicInfo.lastName].join(' ');
  }

  getStatusIcon(customer) {
    if (customer.status === 'updated') {
      return 'explore';
    } else if (customer.status === 'approve') {
      return 'check_circle';
    } else if (customer.status === 'reject') {
      return 'block';
    }
  }

  getApprovalStatusIcon(customer) {
    if (typeof customer.accesses[environment.persona] === 'undefined') {
      return 'block';
    } else if (customer.accesses[environment.persona] === false) {
      return 'watch later';
    } else {
      return 'done';
    }
  }

  onCustomerClick($event, customer) {
    $event.preventDefault();

    const component = this;

    if (typeof customer.accesses[environment.persona] === 'undefined') {
      this.dialog.open(RequestDialogComponent)
        .afterClosed().subscribe(result => {
        if (result) {
          this.service.requestCustomer(customer);
        }
      });

    } else if (customer.accesses[environment.persona] === false) {
      this.dialog.open(MessageDialogComponent, {data: {message: 'Customer approval is awaited'}});
    } else {
      this.service.selectedCustomer = customer;
      this.router.navigate(['/customer', customer.id]);
    }
  }
}

@Component({
  selector: 'app-request-dialog',
  template: '<mat-dialog-content>This will send a request to the customer to provide access. ' +
  'Are you sure you wish to continue</mat-dialog-content><mat-dialog-actions><button mat-button ' +
  '[mat-dialog-close]="false">No</button><button mat-button [mat-dialog-close]="true" ' +
  'cdkFocusInitial>Yes</button></mat-dialog-actions>'
})

export class RequestDialogComponent {
  constructor(public dialogRef: MatDialogRef<RequestDialogComponent>) {
  }
}

@Component({
  selector: 'app-message-dialog',
  template: '<mat-dialog-content>{{ data.message }}</mat-dialog-content><mat-dialog-actions>' +
  '<button mat-button [mat-dialog-close]="true" cdkFocusInitial>Got It</button></mat-dialog-actions>'
})

export class MessageDialogComponent {
  constructor(public dialogRef: MatDialogRef<MessageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
