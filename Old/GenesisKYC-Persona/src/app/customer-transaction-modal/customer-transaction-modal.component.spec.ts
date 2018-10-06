import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTransactionModalComponent } from './customer-transaction-modal.component';

describe('CustomerTransactionModalComponent', () => {
  let component: CustomerTransactionModalComponent;
  let fixture: ComponentFixture<CustomerTransactionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerTransactionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTransactionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
