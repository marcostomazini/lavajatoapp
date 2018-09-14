import {Component} from "@angular/core";
import { Events, LoadingController, NavController, ToastController} from "ionic-angular";
import {ServicoService} from "../../../services/servico-service";
import {PagamentoDetailPage} from "../../movimentacoes/pagamento/pagamento-detail";
import {Storage} from '@ionic/storage';
import * as _ from 'underscore';
import * as moment from 'moment';

export class Pagamento {
    descricao: string = '';
    valor: string = '';
    dataPagamento: string = '';
}

@Component({
  selector: 'page-pagamentos',
  templateUrl: 'pagamentos.html'
})

export class PagamentosPage {  
  public pagamentos: any;
  public somenteDiaAtual: any = true;

  constructor(public nav: NavController, public servicoService: ServicoService, public loadingController: LoadingController,
    public toastCtrl: ToastController, private storage: Storage, public events: Events) {  
    this.getPagamentos();    

    this.events.subscribe('updatePagamento', () => {
      this.getPagamentos();
    });
  }

  criarPagamento() : Pagamento {
    return new Pagamento();    
  }

  alterarCorData(item) {
    var now = moment();
    var dataAtual = moment(now.format(), [moment.ISO_8601]).format("DD/MM");   

    var unixDate = parseInt(item.dataPagamento);
    var dataPagamento = moment(unixDate).format('DD/MM');

    if (dataPagamento != dataAtual) {
      return "dataPassada";
    }
  }

  verificaPagamentosPorDia() {
    var now = moment();
    var dataAtual = moment(now.format(), [moment.ISO_8601]).format("DD/MM");    
    if (this.somenteDiaAtual) {
      this.pagamentos = _.filter(this.pagamentos, function(item)  { 
        var unixDate = parseInt(item.dataPagamento);     
        var dataPagamento = moment(unixDate).format('DD/MM');
        return dataPagamento == dataAtual;
      });
    } 
  }

  // login and go to home page
  getPagamentos() {
    
    let loader = this.loadingController.create({
      content: "carregando pagamentos, aguarde..."
    });  
    loader.present();

    this.storage.get('profile').then((val) => {
      this.servicoService.getPagamentos(val.token)
      .subscribe(
        (res) => {   
          this.pagamentos = res;
          this.verificaPagamentosPorDia();
        },
        (err) => { 
          let toast = this.toastCtrl.create({
              message: err.error,
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();          
            loader.dismiss();
        },
        () => {
          loader.dismiss();
        }
      );
    });       
  }

  deletePagamento(pagamento) {
    let loader = this.loadingController.create({
      content: "enviando ao servidor, aguarde..."
    });  
    loader.present();

    this.storage.get('profile').then((val) => {
      this.servicoService.deletePagamento(val.token, pagamento)
      .subscribe(
        (res) => {
          let toast = this.toastCtrl.create({
              message: "exclusão de pagamento " + pagamento.descricao.toLowerCase(),
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();              
        },
        (err) => { 
          let toast = this.toastCtrl.create({
              message: err.error,
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();          
            loader.dismiss();
        },
        () => {
          this.events.publish('updatePagamento');
            loader.dismiss();
            this.nav.pop();          
        }
      );
    });       
  }

  doInserirPagamento() {
    this.nav.push(PagamentoDetailPage, { pagamento: this.criarPagamento() });
  }

  // view trip detail
  viewDetail(pagamento) {
    this.nav.push(PagamentoDetailPage, { pagamento: pagamento });
  }

}
