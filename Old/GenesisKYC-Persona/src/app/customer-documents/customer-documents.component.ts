import {Component, OnInit} from '@angular/core';
import {Document} from '../models/document';
import {CustomerService} from '../customer.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Customer} from '../models/customer';


@Component({
  selector: 'app-customer-documents',
  templateUrl: './customer-documents.component.html',
  styleUrls: ['./customer-documents.component.css']
})
export class CustomerDocumentsComponent implements OnInit {
  customer: Customer;

  constructor(private customerService: CustomerService, private sanitizer: DomSanitizer) {
    this.customer = this.customerService.selectedCustomer;
  }

  ngOnInit() {
  }

  getDocumentUrl(document: Document) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.customerService.getDocumentUrl(document.documentID, this.customer.id));
  }

}
