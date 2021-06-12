import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HCaptchaService {
  constructor(private httpClient: HttpClient) {}

  httpPost(
    url: string,
    data: { token: string } | { username: string; password: string }
  ) {
    return this.httpClient
      .post(url, data)
      .pipe(catchError((err) => of(err.error)));
  }

  verifyToken(token: string): Observable<Object> {
    return this.httpPost('/verify-hcaptcha', { token });
  }

  postForm(data: { username: string; password: string }): Observable<Object> {
    return this.httpPost('/sign-in', data);
  }
}
