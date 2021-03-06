import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';

import { HttpClientModule } from '@angular/common/http';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateAccountFormComponent } from './create-account-form/create-account-form.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  declarations: [AppComponent, SignInFormComponent, CreateAccountFormComponent, LandingPageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgHcaptchaModule.forRoot({
      siteKey: '0dd6a5b1-c175-4a11-bd4d-6b6d464bd802',
      languageCode: 'en',
    }),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
