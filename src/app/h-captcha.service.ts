import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HCaptchaService {
  constructor(private httpClient: HttpClient) {}

  verifyToken(token: string): Observable<Object> {
    return this.httpClient
      .post('/verify-hcaptcha', {
        token,
      })
      .pipe(catchError((err) => of(err.error)));
  }
}
