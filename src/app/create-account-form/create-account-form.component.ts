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

    if (token) {
      this.tempForm.get('captcha')?.reset();
      this.hCaptchaSubscription = this.captchaService
        .verifyToken(token)
        .subscribe((response: HCaptchaResponse) => {
          if (response.success) {
            this.isTokenValid = true;
          } else if (response.error) {
            this.isTokenValid = false;
            alert(response.error);
          } else {
            alert('verify network failure');
          }
        });
    } else {
      // Show error under hcaptcha widget to check it
      this.isTokenValid = false;
      this.errorMessage = 'Please check the above checkbox';
    }

    if (this.isTokenValid) {
      const payload = {
        username: this.tempForm.get('username')?.value,
        password: this.tempForm.get('password')?.value,
      };
      this.captchaService
        .addUser(payload)
        .subscribe((data: HCaptchaResponse) => {
          if (data.success) {
            this.loader = true;
            timer(3000).subscribe(() => {
              this.router.navigate(['/sign-in']);
            });
          } else if (data.error) {
            this.errorMessage = data.error;
            
          } else {
            alert('network error !!!');
          }
        });
    }
  }
}
