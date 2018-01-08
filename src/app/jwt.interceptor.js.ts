import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = 'http://localhost:8080/';
    // add authorization header with jwt token if available
    let authorization = localStorage.getItem('currentUser');
    if (authorization == null) {
      authorization = '';
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
