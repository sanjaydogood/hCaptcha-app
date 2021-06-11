import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';

import { HttpClientModule } from '@angular/common/http';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, SignInFormComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgHcaptchaModule.forRoot({
      siteKey: '10000000-ffff-ffff-ffff-000000000001',
      languageCode: 'en',
    }),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
