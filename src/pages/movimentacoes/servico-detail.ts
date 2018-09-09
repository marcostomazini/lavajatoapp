import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {ServicoService} from "../../services/servico-service";

@Component({
  selector: 'page-servico-detail',
  templateUrl: 'servico-detail.html'
})
export class ServicoDetailPage {
  // trip info
  public servico: any;

  public paymethods = 'dinheiro';

  constructor(public nav: NavController, public servicoService: ServicoService) {
    // set sample data
    this.servico = servicoService.getItem(1);
  }
}
