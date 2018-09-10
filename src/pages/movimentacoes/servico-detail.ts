import { Component } from "@angular/core";
import { Events, LoadingController, NavParams, NavController,AlertController, ToastController} from "ionic-angular";
import { ServicoService } from "../../services/servico-service";
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-servico-detail',
  templateUrl: 'servico-detail.html'
})
export class ServicoDetailPage {
  // trip info
  public servico: any; 

  constructor(public nav: NavController, public servicoService: ServicoService, public navParams: NavParams,
  	public loadingController: LoadingController, public forgotCtrl: AlertController, public toastCtrl: ToastController, 
  	private storage: Storage, public events: Events) {

    this.servico = navParams.get("servico");
  }

  cancel() {
  	this.nav.pop();
  }

  saveItem(servico) {
  	let loader = this.loadingController.create({
      content: "enviando ao servidor, aguarde..."
    });  
    loader.present();

    this.storage.get('profile').then((val) => {
      this.servicoService.saveServicos(val.token, servico)
      .subscribe(
        (res) => {
          this.servico = res;
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
        	this.events.publish('updateServico');
          	loader.dismiss();
          	this.nav.pop();          
        }
      );
    });       
  }
}
