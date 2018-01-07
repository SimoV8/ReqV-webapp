import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

const CURRENT_USER = 'currentUser';

@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return new Observable(subscriber =>
      this.http.post('/api/login', {username: username, password: password}, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        observe: 'response',
        })
        .subscribe(
          (response: HttpResponse<any>) => {
            console.log(response);
            localStorage.setItem(CURRENT_USER, response.headers.get('Authorization'));
            subscriber.next(response);
          },
          error => subscriber.error(error)
        )
    );
  }

  getToken(): string {
    return localStorage.getItem(CURRENT_USER);
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return tokenNotExpired(null, token);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(CURRENT_USER);
  }

}
