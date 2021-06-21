import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { HCaptchaService } from '../h-captcha.service';
import { HCaptchaResponse } from '../HCaptchaResponse.model';

@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss'],
})
export class CreateAccountFormComponent implements OnInit {
  tempForm: FormGroup;
  hCaptchaSubscription: any;
  isTokenValid = true;
  isFormValid = false;
  errorMessage = '';
  loader = false;
  exists = false;
  constructor(
    private form: FormBuilder,
    private captchaService: HCaptchaService,
    private router: Router
  ) {
    this.tempForm = this.form.group({
      username: [''],
      password: [''],
      captcha: [''],
    });

    this.tempForm.valueChanges.subscribe((formData) => {
      this.isFormValid = formData.username !== '' && formData.password !== '';
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    const token = this.tempForm.get('captcha')?.value;

    this.tempForm.get('captcha')?.reset();
    this.hCaptchaSubscription = this.captchaService
      .verifyToken(token)
      .subscribe((response: HCaptchaResponse) => {
        if (response.success) {
          this.isTokenValid = true;
          this.errorMessage = '';
        } else if (response.error) {
          this.isTokenValid = false;
          this.errorMessage = response.error;
        }
      });

    if (this.isTokenValid) {
      const payload = {
        username: this.tempForm.get('username')?.value,
        password: this.tempForm.get('password')?.value,
      };
      this.captchaService.addUser(payload).subscribe((data) => {
        if (data.success) {
          this.loader = true;
          timer(3000).subscribe(() => {
            this.router.navigate(['/sign-in']);
          });
        } else {
          this.errorMessage = `${data.error}`;
          this.exists = true;
        }
      });
    }
  }
}
