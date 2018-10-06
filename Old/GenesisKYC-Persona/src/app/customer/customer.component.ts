import {Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {Customer} from '../models/customer';
import {CustomerService} from '../customer.service';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})

export class CustomerComponent implements OnInit, OnDestroy {
  customer: Customer;

  mobileQuery: MediaQueryList;
  sideNavOpen = true;

  private _mobileQueryListener: () => void;

  constructor(private router: Router, private route: ActivatedRoute, private customerService: CustomerService,
              changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.customer = this.customerService.selectedCustomer;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  getPersona() {
    return environment.persona;
  }
}
