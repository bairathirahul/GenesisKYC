import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDocumentsComponent } from './customer-documents.component';

describe('CustomerDocumentsComponent', () => {
  let component: CustomerDocumentsComponent;
  let fixture: ComponentFixture<CustomerDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
