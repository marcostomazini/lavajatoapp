import {Component} from "@angular/core";
import { Events, LoadingController, NavController, ToastController} from "ionic-angular";
import {ServicoService} from "../../../services/servico-service";
import {DepositoDetailPage} from "../../movimentacoes/deposito/deposito-detail";
import {Storage} from '@ionic/storage';
import * as _ from 'underscore';
import * as moment from 'moment';

export class Deposito {
    descricao: string = '';
    valor: string = '';
    dataDeposito: string = '';
}

@Component({
  selector: 'page-depositos',
  templateUrl: 'depositos.html'
})

export class DepositosPage {  
  public depositos: any;
  public somenteDiaAtual: any = true;

  constructor(public nav: NavController, public servicoService: ServicoService, public loadingController: LoadingController,
    public toastCtrl: ToastController, private storage: Storage, public events: Events) {  
    this.getDepositos();    

    this.events.subscribe('updateDeposito', () => {
      this.getDepositos();
    });
  }

  criarDeposito() : Deposito {
    return new Deposito();    
  }

  alterarCorData(item) {
    var now = moment();
    var dataAtual = moment(now.format(), [moment.ISO_8601]).format("DD/MM");   

    var unixDate = parseInt(item.dataDeposito);
    var dataDeposito = moment(unixDate).format('DD/MM');

    if (dataDeposito != dataAtual) {
      return "dataPassada";
    }
  }

  verificaDepositosPorDia() {
    var now = moment();
    var dataAtual = moment(now.format(), [moment.ISO_8601]).format("DD/MM");    
    if (this.somenteDiaAtual) {
      this.depositos = _.filter(this.depositos, function(item)  { 
        var unixDate = parseInt(item.dataDeposito);     
        var dataDeposito = moment(unixDate).format('DD/MM');
        return dataDeposito == dataAtual;
      });
    } 
  }

  // login and go to home page
  getDepositos() {
    
    let loader = this.loadingController.create({
      content: "carregando depositos, aguarde..."
    });  
    loader.present();

    this.storage.get('profile').then((val) => {
      this.servicoService.getDepositos(val.token)
      .subscribe(
        (res) => {   
          this.depositos = res;
          this.verificaDepositosPorDia();
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

  deleteDeposito(deposito) {
    let loader = this.loadingController.create({
      content: "enviando ao servidor, aguarde..."
    });  
    loader.present();

    this.storage.get('profile').then((val) => {
      this.servicoService.deleteDeposito(val.token, deposito)
      .subscribe(
        (res) => {
          let toast = this.toastCtrl.create({
              message: "exclusão de deposito " + deposito.descricao.toLowerCase(),
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
          this.events.publish('updateDeposito');
            loader.dismiss();
            this.nav.pop();          
        }
      );
    });       
  }

  doInserirDeposito() {
    this.nav.push(DepositoDetailPage, { deposito: this.criarDeposito() });
  }

  // view trip detail
  viewDetail(deposito) {
    this.nav.push(DepositoDetailPage, {deposito: deposito});
  }

}
