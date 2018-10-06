import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatOptionModule,
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatListModule,
  MatIconModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule
} from '@angular/material';

import {AppComponent} from './app.component';
import {CustomersComponent, RequestDialogComponent, MessageDialogComponent} from './customers/customers.component';
import {CustomerComponent} from './customer/customer.component';
import {HttpClientModule} from '@angular/common/http';
import {CustomerService} from './customer.service';
import {FilterDeletedPipe} from './filter-deleted.pipe';
import {MediaMatcher} from '@angular/cdk/layout';
import {CustomerInformationComponent} from './customer-information/customer-information.component';
import {CustomerDocumentsComponent} from './customer-documents/customer-documents.component';
import {CustomerTransactionsComponent} from './customer-transactions/customer-transactions.component';
import { CustomerTransactionModalComponent } from './customer-transaction-modal/customer-transaction-modal.component';

const appRoutes: Routes = [
  {path: 'customers', component: CustomersComponent},
  {
    path: 'customer/:id', component: CustomerComponent, children: [
    {path: '', component: CustomerInformationComponent},
    {path: 'transactions', component: CustomerTransactionsComponent},
    {path: 'documents', component: CustomerDocumentsComponent}
  ]
  },
  {path: '**', redirectTo: '/customers', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    RequestDialogComponent,
    MessageDialogComponent,
    CustomersComponent,
    CustomerComponent,
    FilterDeletedPipe,
    CustomerInformationComponent,
    CustomerDocumentsComponent,
    CustomerTransactionsComponent,
    CustomerTransactionModalComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes, {enableTracing: false}),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  entryComponents: [RequestDialogComponent, MessageDialogComponent, CustomerTransactionModalComponent],
  providers: [CustomerService, MediaMatcher],
  bootstrap: [AppComponent]
})
export class AppModule {
}
