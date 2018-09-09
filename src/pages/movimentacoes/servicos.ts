import {Component} from "@angular/core";
import { LoadingController, NavController,AlertController, ToastController} from "ionic-angular";
import {ServicoService} from "../../services/servico-service";
import {ServicoDetailPage} from "../movimentacoes/servico-detail";
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-servicos',
  templateUrl: 'servicos.html'
})
export class ServicosPage {
  // list of trips
  public servicos: any;

  constructor(public nav: NavController, public servicoService: ServicoService, public loadingController: LoadingController,
    public forgotCtrl: AlertController, public toastCtrl: ToastController, private storage: Storage) {
    this.getServicos();
  }

  // login and go to home page
  getServicos() {   
    
    let loader = this.loadingController.create({
      content: "carregando serviços, aguarde..."
    });  
    loader.present();

    this.storage.get('profile').then((val) => {
      this.servicoService.getServicos(val.token)
      .subscribe(
        (res) => {           
          this.servicos = res;
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

  // view trip detail
  viewDetail(servico) {
    this.nav.push(ServicoDetailPage, {servico: servico});
  }

  doFinalizarServico(item) {
    if (item.situacao === 'Finalizado') {
     let alert = this.forgotCtrl.create({
        title: 'dinheiro',
        inputs: [
          {
            name: 'digite o valor',
            placeholder: 'valor',
            type: 'number'
          }
        ],
        buttons: [
          {
            text: 'cancelar',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'salvar',
            handler: data => {
              item.situacao = 'Pago';
            }
          }
        ]
      });
      alert.present();      
    } else {
      let forgot = this.forgotCtrl.create({
        title: 'Finalizar Serviço?',
        message: "<p>Confirme os dados que receberá a notificação de finalização de serviço.</p>" +
          "<ul><li>cliente: " + item.nomeCliente + "</li>" +
          "<li>placa: " + item.placa +
          "</li></ul>",
        inputs: [
          {
            name: 'celular',
            placeholder: 'celular',
            type: 'celular',
            value: item.celular
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Somente Finalizar',
            handler: data => {
              console.log('Finalizar somente clicked');
              let toast = this.toastCtrl.create({
                message: 'Finalizar enviado',
                duration: 3000,
                position: 'top',
                cssClass: 'dark-trans',
                closeButtonText: 'OK',
                showCloseButton: true
              });
              toast.present();
              item.situacao = 'Finalizado';
            }
          },
          {
            text: 'WhatsApp',
            handler: data => {
              console.log('Send wp clicked');
              let toast = this.toastCtrl.create({
                message: 'Whats enviado',
                duration: 3000,
                position: 'top',
                cssClass: 'dark-trans',
                closeButtonText: 'OK',
                showCloseButton: true
              });
              toast.present();
            }
          },
          {
            text: 'SMS',
            handler: data => {
              console.log('Send sms clicked');
              let toast = this.toastCtrl.create({
                message: 'SMS enviado',
                duration: 3000,
                position: 'top',
                cssClass: 'dark-trans',
                closeButtonText: 'OK',
                showCloseButton: true
              });
              toast.present();
            }
          }
        ]
      });
      forgot.present();
    }
  }
}
