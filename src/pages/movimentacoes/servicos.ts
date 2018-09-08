import {Component} from "@angular/core";
import {NavController,AlertController, ToastController} from "ionic-angular";
import {ServicoService} from "../../services/servico-service";
import {TripDetailPage} from "../trip-detail/trip-detail";

@Component({
  selector: 'page-servicos',
  templateUrl: 'servicos.html'
})
export class ServicosPage {
  // list of trips
  public servicos: any;

  constructor(public nav: NavController, public servicoService: ServicoService, public forgotCtrl: AlertController, public toastCtrl: ToastController) {
    this.servicos = servicoService.getAll();
  }

  // view trip detail
  viewDetail(id) {
    this.nav.push(TripDetailPage, {id: id});
  }

  doFinalizarServico(item) {
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
