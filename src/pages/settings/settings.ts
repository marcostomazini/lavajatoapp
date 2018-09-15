import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Storage} from '@ionic/storage';
import { Events } from "ionic-angular";

export interface Configuracao {
  url: string;    
}

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {

   public configuracao: Configuracao = {
    url: ''
  }

  constructor(public nav: NavController, private storage: Storage, private events: Events) {
    this.getConfiguracao();
  }

  getConfiguracao() {
    this.storage.get('configuracao').then((val) => {
      this.configuracao = val;
    });
  }

  save() {
  	this.storage.set('configuracao', this.configuracao).then((val) => {
      this.events.publish('updateConfiguracao', val);
  		this.nav.pop();
  	});
  }
  
  cancel() {
    this.nav.pop();
  }
}
