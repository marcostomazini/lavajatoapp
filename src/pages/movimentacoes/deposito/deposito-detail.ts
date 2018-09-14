import { Component } from "@angular/core";
import { Events, LoadingController, NavParams, NavController, ToastController} from "ionic-angular";
import { ServicoService } from "../../../services/servico-service";
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-deposito-detail',
  templateUrl: 'deposito-detail.html'
})
export class DepositoDetailPage {
  // trip info
  public deposito: any; 

  constructor(public nav: NavController, public servicoService: ServicoService, public navParams: NavParams,
  	public loadingController: LoadingController, public toastCtrl: ToastController, 
  	private storage: Storage, public events: Events) {
    
    this.deposito = navParams.get("deposito");
  }

  cancel() {
  	this.nav.pop();
  }

  saveItem(deposito) {
  	let loader = this.loadingController.create({
      content: "enviando ao servidor, aguarde..."
    });  
    loader.present();

    this.storage.get('profile').then((val) => {
      this.servicoService.saveDepositos(val.token, deposito)
      .subscribe(
        (res) => {
          this.deposito = res;
          let toast = this.toastCtrl.create({
              message: "salvo com sucesso",
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
}
