import { Component } from "@angular/core";
import { Events, LoadingController, NavParams, NavController, ToastController} from "ionic-angular";
import { ServicoService } from "../../../services/servico-service";
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-pagamento-detail',
  templateUrl: 'pagamento-detail.html'
})
export class PagamentoDetailPage {
  // trip info
  public pagamento: any; 

  constructor(public nav: NavController, public servicoService: ServicoService, public navParams: NavParams,
  	public loadingController: LoadingController, public toastCtrl: ToastController, 
  	private storage: Storage, public events: Events) {
    
    this.pagamento = navParams.get("pagamento");
  }

  cancel() {
  	this.nav.pop();
  }

  saveItem(pagamento) {
  	let loader = this.loadingController.create({
      content: "enviando ao servidor, aguarde..."
    });  
    loader.present();

    this.storage.get('profile').then((val) => {
      this.servicoService.savePagamentos(val.token, pagamento)
      .subscribe(
        (res) => {
          this.pagamento = res;
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
        	this.events.publish('updatePagamento');
          	loader.dismiss();
          	this.nav.pop();          
        }
      );
    });       
  }
}
