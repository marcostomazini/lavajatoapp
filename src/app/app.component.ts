import { Component, ViewChild } from "@angular/core";
import { Events, Platform, Nav } from "ionic-angular";

import {Storage} from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { LocalWeatherPage } from "../pages/local-weather/local-weather";
import { ServicosPage } from "../pages/movimentacoes/servicos";

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}

export class Profile {
    name: string = '';
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  appMenuItems: Array<MenuItem>;
  profile: Profile;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public keyboard: Keyboard,
    private storage: Storage,
    public events: Events
  ) {
    this.initializeApp();

    this.appMenuItems = [
      {title: 'Inicio', component: ServicosPage, icon: 'home'},
      {title: 'Serviços', component: ServicosPage, icon: 'people'},
      {title: 'Pagamentos', component: HomePage, icon: 'card'},
      {title: 'Depositos', component: LocalWeatherPage, icon: 'mail'}
    ];

    this.events.subscribe('logged', (profile) => {
      this.profile = profile;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.

      //*** Control Splash Screen
      this.splashScreen.show();
      this.splashScreen.hide();

      //*** Control Status Bar
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);

      //*** Control Keyboard
      this.keyboard.disableScroll(true);  
    });

    this.profile = new Profile;

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario    
    this.nav.setRoot(page.component);
  }

  logout() {    
    this.nav.setRoot(LoginPage);
    this.profile = new Profile;
  }

}
