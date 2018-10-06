import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTransactionsComponent } from './customer-transactions.component';

describe('CustomerTransactionsComponent', () => {
  let component: CustomerTransactionsComponent;
  let fixture: ComponentFixture<CustomerTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
