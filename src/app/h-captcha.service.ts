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
    const remoteUrl = 'https://vast-scrubland-92936.herokuapp.com/sign-up';
    const localUrl = 'http://localhost:8080/sign-up';
    return this.httpClient
      .post(localUrl, {
        token,
      })
      .pipe(catchError((err) => of(err.error)));
  }
}
