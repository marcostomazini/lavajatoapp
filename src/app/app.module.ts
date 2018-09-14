import {NgModule} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SMS } from '@ionic-native/sms';

import {Ionic2MaskDirective} from "ionic2-mask-directive";

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Keyboard} from '@ionic-native/keyboard';

import {ActivityService} from "../services/activity-service";
import {TripService} from "../services/trip-service";
import {WeatherProvider} from "../services/weather";
import { ServicoService } from "../services/servico-service";
import { LoginService } from "../services/login-service";

import {MyApp} from "./app.component";

import {SettingsPage} from "../pages/settings/settings";
import {CheckoutTripPage} from "../pages/checkout-trip/checkout-trip";
import {HomePage} from "../pages/home/home";
import {LoginPage} from "../pages/login/login";
import {NotificationsPage} from "../pages/notifications/notifications";
import {RegisterPage} from "../pages/register/register";
import {SearchLocationPage} from "../pages/search-location/search-location";
import {TripDetailPage} from "../pages/trip-detail/trip-detail";
import {TripsPage} from "../pages/trips/trips";
import {LocalWeatherPage} from "../pages/local-weather/local-weather";

import { ServicosPage } from "../pages/movimentacoes/servicos";
import { ServicoDetailPage } from "../pages/movimentacoes/servico-detail";

import { DepositosPage } from "../pages/movimentacoes/deposito/depositos";
import { DepositoDetailPage } from "../pages/movimentacoes/deposito/deposito-detail";

import { PagamentosPage } from "../pages/movimentacoes/pagamento/pagamentos";
import { PagamentoDetailPage } from "../pages/movimentacoes/pagamento/pagamento-detail";

// import services
// end import services
// end import services

// import pages
// end import pages

@NgModule({
  declarations: [
    MyApp,
    Ionic2MaskDirective,
    SettingsPage,
    CheckoutTripPage,
    HomePage,
    LoginPage,
    LocalWeatherPage,
    NotificationsPage,
    RegisterPage,
    SearchLocationPage,
    TripDetailPage,
    TripsPage,
    
    ServicosPage,
    ServicoDetailPage,

    PagamentosPage,
    PagamentoDetailPage,

    DepositosPage,
    DepositoDetailPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false,
      preloadModules: true
    }),
    IonicStorageModule.forRoot({
      name: '__arquitetaweb_lavajato',
        driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SettingsPage,
    CheckoutTripPage,
    HomePage,
    LoginPage,
    LocalWeatherPage,
    NotificationsPage,
    RegisterPage,
    SearchLocationPage,
    TripDetailPage,
    TripsPage,
    ServicosPage,
    ServicoDetailPage,
    DepositosPage,
    DepositoDetailPage,
    PagamentosPage,
    PagamentoDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    InAppBrowser,
    SMS,
    ActivityService,
    TripService,
    WeatherProvider,
    ServicoService,
    LoginService
  ]
})

export class AppModule {

}
