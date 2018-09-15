import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Events } from "ionic-angular";
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';

@Injectable()
export class ServicoService {
  url: string;
  response: any;
  //urlPrincipal = 'http://leilao.arquitetaweb.com';
  public urlPrincipal: string;
  //urlPrincipal = 'http://localhost:3000';
  urlMobile = '/api/mobile/';

  constructor(public http: HttpClient, private storage: Storage, private events: Events) {
        
    this.events.subscribe('updateConfiguracao', (val) => {
      this.setLocalConfiguracao(val);
    });
  }

// #region Servicos

  getServicos(token) {
    return this.getGeneric(token, 'servicos');
  }  

  saveServicos(token, servico) {
    const headerDict = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    if (servico.placa != undefined || servico.placa != '')
      servico.placa = servico.placa.toUpperCase();

    if (servico._id == undefined) {
      return this.http.post(this.url + 'servicos', servico, requestOptions).map(res => res);
    } else {
      if (servico.valorRecebido.length > 0) {
        var now = moment();
        var dataHoraSaida = moment(now.format(), moment.ISO_8601).format('x');

        servico.situacao = 'Pago';
        servico.dataHoraSaida = dataHoraSaida;
      }
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

    if (servico.valorRecebido.length > 0 && situacao == 'Finalizado') {
      var now = moment();
      var horaSaida = moment(now.format(), moment.ISO_8601).format('x');
      servico.dataHoraSaida = horaSaida;
    }

    servico.situacao = situacao;

    return this.http.put(this.url + 'servico/' + servico._id, servico, requestOptions).map(res => res);
  }

// #endregion Servicos

// #region Configuracoes

  getConfiguracoes(token) {
    return this.getGeneric(token, 'configuracoes');    
  }  

// #endregion Configuracoes

// #region Depositos

  getDepositos(token) {
    return this.getGeneric(token, 'depositos');    
  }  

  saveDepositos(token, deposito) {
    const headerDict = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    if (deposito._id == undefined) {
      var now = moment();
      var dataDeposito = moment(now.format(), moment.ISO_8601).format('x');
      deposito.dataDeposito = dataDeposito;

      return this.http.post(this.url + 'depositos', deposito, requestOptions).map(res => res);
    } else {  
      return this.http.put(this.url + 'deposito/' + deposito._id, deposito, requestOptions).map(res => res);
    }
  }

  deleteDeposito(token, item) {
    return this.deleteGeneric(token, item, 'deposito');   
  }

// #endregion Depositos

// #region Pagamentos

  getPagamentos(token) {
    return this.getGeneric(token, 'pagamentos');
  }  

  savePagamentos(token, pagamento) {
    const headerDict = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    if (pagamento._id == undefined) {
      var now = moment();
      var dataPagamento = moment(now.format(), moment.ISO_8601).format('x');
      pagamento.dataPagamento = dataPagamento;

      return this.http.post(this.url + 'pagamentos', pagamento, requestOptions).map(res => res);
    } else {
      return this.http.put(this.url + 'pagamento/' + pagamento._id, pagamento, requestOptions).map(res => res);
    }
  }

  deletePagamento(token, item) {
    return this.deleteGeneric(token, item, 'pagamento');   
  }

// #endregion Depositos

// #region Login

  login(user) {
    return this.http.post(this.urlPrincipal + '/auth/signin', user).map(res => res);
  }
    
// #endregion Login
  
// #region Utils

  /*getItem(id) {
    for (var i = 0; i < this.servicos.length; i++) {
      if (this.servicos[i]._id === id) {

        return this.servicos[i];
      }
    }
    return null;
  }*/  

  saveLocalConfiguracao(configuracao) {
    return this.storage.set('configuracao', configuracao);
  }

  setLocalConfiguracao(configuracao) {
    if (configuracao != null) {
      this.urlPrincipal = configuracao.url;
      this.url = this.urlPrincipal + this.urlMobile;
    }
  }

  getLocalConfiguracao() : Promise<{ url: string }> {
    return new Promise((resolve, reject) => {      
      this.storage.get('configuracao').then((val) => {
        this.setLocalConfiguracao(val);
        resolve(val);
      });      
    });    
  }

  deleteGeneric(token, item, modulo) {
    const headerDict = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    item.excluido = true;

    return this.http.put(this.url + modulo + '/' + item._id, item, requestOptions).map(res => res);
  }

  getGeneric(token, modulo) {
    const headerDict = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    return this.http.get(this.url + modulo, requestOptions).map(res => res);
  }

// #endregion Utils

}