import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private hCap: HCaptchaService) {
    this.tempForm = this.fb.group({
      username: [''],
      password: [''],
      captcha: [''],
    });

    this.tempForm.valueChanges.subscribe((formData) => {
      console.log(formData.firstName);
      this.isFormValid = formData.username !== '' && formData.password !== '';
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    const token = this.tempForm.get('captcha')?.value;

    if (token) {
      this.hCaptchaSubscription = this.hCap
        .verifyToken(token)
        .subscribe((response: HCaptchaResponse) => {
          if (response.success) {
            console.log('successful bhai: ', response.success);
            this.isTokenValid = true;
          } else if (response.error) {
            console.log('error bhai: ', response.error);
            this.isTokenValid = false;
            // Show error messsage
          }
        });
    } else {
      // Show error under hcaptcha widget to check it
      this.isTokenValid = false;
      this.errorMessage = 'Please check the above checkbox';
    }

    if (this.isTokenValid) {
      // Submit Form
      const payload = {
        username: this.tempForm.get('username')?.value,
        password: this.tempForm.get('password')?.value,
      };
      this.hCap
        .postForm(payload)
        .subscribe((data) => console.log('response form sign-in: ', data));
    }
  }
}
