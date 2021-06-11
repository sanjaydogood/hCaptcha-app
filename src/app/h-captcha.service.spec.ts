import { TestBed } from '@angular/core/testing';

import { HCaptchaService } from './h-captcha.service';

describe('HCaptchaService', () => {
  let service: HCaptchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HCaptchaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
