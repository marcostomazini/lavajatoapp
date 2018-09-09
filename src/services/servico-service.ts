import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage';

@Injectable()
export class ServicoService {
  private servicos: any;

  url: string;
  response: any;
  urlPrincipal = 'http://leilao.arquitetaweb.com';
  //urlPrincipal = 'http://localhost:3000';
  urlMobile = '/api/mobile/'; 

  constructor(public http: HttpClient, private storage: Storage) {
    this.url = this.urlPrincipal + this.urlMobile;
    //this.servicos = SERVICOS;    
  }

  getServicos(token) {
    const headerDict = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token                          
    }

    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    return this.http.get(this.url + 'servicos', requestOptions).map(res => res);
  }

  getItem(id) {
    for (var i = 0; i < this.servicos.length; i++) {
      if (this.servicos[i]._id === id) {
        return this.servicos[i];
      }
    }
    return null;
  }

}
