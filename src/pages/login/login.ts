import {Component} from "@angular/core";
import { Events, LoadingController, NavController, AlertController, ToastController, MenuController } from "ionic-angular";
import {HomePage} from "../home/home";
import {RegisterPage} from "../register/register";
import {ServicosPage} from "../movimentacoes/servicos";
import {ServicoService} from "../../services/servico-service";
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public profile: any;
  public user = {
    username: 'teste@teste.com',
    password: 'teste123'
  };
  
  constructor(public nav: NavController, public events: Events, public loadingController: LoadingController, 
    public forgotCtrl: AlertController, public menu: MenuController, private storage: Storage, 
    public toastCtrl: ToastController, public servicoService: ServicoService) {
    this.menu.swipeEnable(false);
  }

  // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }

  // login and go to home page
  login(request) {   
    //this.storage.remove('profile');
    let loader = this.loadingController.create({
      content: "aguarde..."
    });  
    loader.present();        

    this.servicoService.login(request)
      .subscribe(
        (res) => {           
          this.profile = res;
          this.storage.set('profile', this.profile);
          if (this.profile.ativo == true) {
            this.events.publish('logged', this.profile);
            this.nav.setRoot(ServicosPage);
          }
        },
        (err) => { 
          let error = JSON.parse(err.error);
          let toast = this.toastCtrl.create({
              message: error.message,
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
  }

  semAcao() {
    let toast = this.toastCtrl.create({
        message: 'não implementado, entrar em contato com marcos.tomazini@gmail.com',
        duration: 3000,
        position: 'top',
        cssClass: 'dark-trans',
        closeButtonText: 'OK',
        showCloseButton: true
      });
      toast.present();
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Forgot Password?',
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Send clicked');
            let toast = this.toastCtrl.create({
              message: 'Email was sended successfully',
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
