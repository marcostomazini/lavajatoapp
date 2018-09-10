import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class ServicoService {
  private servicos: any;

  url: string;
  response: any;
  urlPrincipal = 'http://leilao.arquitetaweb.com';
  //urlPrincipal = 'http://localhost:3000';
  urlMobile = '/api/mobile/'; 

  constructor(public http: HttpClient) {
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

  saveServicos(token, servico) {
    const headerDict = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token                          
    }

    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    if (servico.placa != undefined) 
        servico.placa = servico.placa.toUpperCase();
      
    if (servico._id == undefined) {     
      return this.http.post(this.url + 'servicos', servico, requestOptions).map(res => res);
    } else {
      if (servico.valorRecebido.length > 0)
        servico.situacao = 'Pago';
      return this.http.put(this.url + 'servico/' + servico._id, servico, requestOptions).map(res => res);
    }    
  }

  alteraSituacao(token, servico, situacao) {
    const headerDict = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token                          
    }

    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(headerDict), 
    };

    servico.situacao = situacao;

    return this.http.put(this.url + 'servico/' + servico._id, servico, requestOptions).map(res => res);
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
