import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CustomerService} from './customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GenesisKYC Persona';

  constructor(private router: Router, private customerService: CustomerService) {
  }

  ngOnInit() {
    if (!this.customerService.customers) {
      this.router.navigate(['/']);
    }
  }
}
