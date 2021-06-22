import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
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
            this.addingUser();
          } else if (response.error) {
            alert(response.error);
          } else {
            alert('Network Error, Please try again !');
          }
        });
    } else {
      this.errorMessage = 'Please check the above checkbox';
    }
  }

  addingUser(): void {
    const payload = {
      username: this.tempForm.get('username')?.value,
      password: this.tempForm.get('password')?.value,
    };
    this.captchaService.addUser(payload).subscribe((data: HCaptchaResponse) => {
      if (data.success) {
        this.loader = true;
        timer(3000).subscribe(() => {
          this.router.navigate(['/sign-in']);
        });
      } else if (data.error) {
        this.errorMessage = data.error;
      } else {
        alert('Network Error, Please try again !');
      }
    });
  }
}
