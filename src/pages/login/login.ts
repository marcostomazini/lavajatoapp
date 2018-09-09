import {Component} from "@angular/core";
import {LoadingController, NavController, AlertController, ToastController, MenuController } from "ionic-angular";
import {HomePage} from "../home/home";
import {RegisterPage} from "../register/register";
import {ServicosPage} from "../movimentacoes/servicos";
import {LoginService} from "../../services/login-service";
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  profile: any;
  public user = {
    username: 'teste@teste.com',
    password: 'teste123'
  };
  
  constructor(public nav: NavController, public loadingController: LoadingController, public forgotCtrl: AlertController, public menu: MenuController, 
  public toastCtrl: ToastController, public loginService: LoginService) {
    this.menu.swipeEnable(false);
  }

  // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }

  // login and go to home page
  login(request) {   
    
    let loader = this.loadingController.create({
      content: "aguarde..."
    });  
    loader.present();

    this.loginService.login(request)
      .subscribe(
        (res) => { 
          this.profile = res;
          if (this.profile.ativo == true) {
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
        },
        () => {
          loader.dismiss();
        }
      );
  }

  // login and go to home page
  loginGmail(user) {
    this.login(user);
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
