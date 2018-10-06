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
  MatNativeDateModule
} from '@angular/material';

import {AppComponent} from './app.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {ProfileComponent} from './profile/profile.component';
import {ProfileBasicComponent} from './profile-basic/profile-basic.component';
import {ProfileAddressComponent} from './profile-address/profile-address.component';
import {ProfileContactComponent} from './profile-contact/profile-contact.component';
import {ProfileEmploymentComponent} from './profile-employment/profile-employment.component';
import {ProfileBankAccountComponent} from './profile-bank-account/profile-bank-account.component';
import {HttpClientModule} from '@angular/common/http';
import {CustomerService} from './customer.service';
import {ProfileDocumentsComponent} from './profile-documents/profile-documents.component';
import {FilterDeletedPipe} from './filter-deleted.pipe';
import {MediaMatcher} from '@angular/cdk/layout';
import {RegisteredComponent} from './registered/registered.component';
import {ProfileRequestComponent} from './profile-request/profile-request.component';
import {ProfileCommentComponent} from './profile-comment/profile-comment.component';

const appRoutes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registered', component: RegisteredComponent},
  {
    path: 'profile', component: ProfileComponent, children: [
    {path: '', redirectTo: 'basicInfo', pathMatch: 'full'},
    {path: 'basicInfo', component: ProfileBasicComponent},
    {path: 'addresses', component: ProfileAddressComponent},
    {path: 'contacts', component: ProfileContactComponent},
    {path: 'employments', component: ProfileEmploymentComponent},
    {path: 'bank-accounts', component: ProfileBankAccountComponent},
    {path: 'documents', component: ProfileDocumentsComponent},
    {path: 'comments', component: ProfileCommentComponent},
    {path: 'requests', component: ProfileRequestComponent},
  ]
  },
  {path: 'requests', component: ProfileComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    ProfileBasicComponent,
    ProfileAddressComponent,
    ProfileContactComponent,
    ProfileEmploymentComponent,
    ProfileBankAccountComponent,
    ProfileDocumentsComponent,
    FilterDeletedPipe,
    RegisteredComponent,
    ProfileRequestComponent,
    ProfileCommentComponent
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
    MatNativeDateModule
  ],
  providers: [CustomerService, MediaMatcher],
  bootstrap: [AppComponent]
})
export class AppModule {
}
