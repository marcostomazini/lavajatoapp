import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {
  url: string;
  response: any;
  urlPrincipal = 'http://leilao.arquitetaweb.com';
  //urlPrincipal = 'http://localhost:3000';
  urlMobile = '/api/mobile/';

  constructor(public http: HttpClient) {
    this.url = this.urlPrincipal + this.urlMobile;
  }

  login(user) {    
    return this.http.post(this.urlPrincipal + '/auth/signin', user).map(res => res);
  }
}
 