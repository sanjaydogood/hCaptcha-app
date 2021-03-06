import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HCaptchaService } from '../h-captcha.service';
import { HCaptchaResponse } from '../HCaptchaResponse.model';

@Component({
  selector: 'sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss'],
})
export class SignInFormComponent implements OnInit {
  hCaptchaSubscription: any;
  isTokenValid = true;
  isFormValid = false;
  errorMessage = '';
  tempForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private hCap: HCaptchaService,
    private router: Router
  ) {
    this.tempForm = this.fb.group({
      username: [''],
      password: [''],
      captcha: [''],
    });

    this.tempForm.valueChanges.subscribe((formData) => {
      this.isFormValid = formData.username !== '' && formData.password !== '';
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    const token = this.tempForm.get('captcha')?.value;

    if (token) {
      this.tempForm.get('captcha')?.reset();
      this.hCaptchaSubscription = this.hCap
        .verifyToken(token)
        .subscribe((response: HCaptchaResponse) => {
          if (response.success) {
            this.isTokenValid = true;
          } else if (response.error) {
            this.isTokenValid = false;
            this.errorMessage = response.error;
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
      this.hCap.postForm(payload).subscribe((data) => {
        this.router.navigate(['/landing-page']);
      });
    }
  }
}
