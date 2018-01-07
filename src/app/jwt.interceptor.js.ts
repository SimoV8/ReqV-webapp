import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const url = 'http://localhost:8080';
    let authorization = '';
    if (currentUser && currentUser.token) {
      authorization =  `Bearer ${currentUser.token}`;
    }

    request = request.clone({
      url: url + request.url,
      setHeaders: {
        Authorization: authorization
      }
    });

    return next.handle(request);
  }
}
