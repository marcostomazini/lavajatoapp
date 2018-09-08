import {Injectable} from "@angular/core";
import {SERVICOS} from "./mock-servicos";

@Injectable()
export class ServicoService {
  private servicos: any;

  constructor() {
    this.servicos = SERVICOS;
  }

  getAll() {
    return this.servicos;
  }

  getItem(id) {
    for (var i = 0; i < this.servicos.length; i++) {
      if (this.servicos[i].id === parseInt(id)) {
        return this.servicos[i];
      }
    }
    return null;
  }

  remove(item) {
    this.servicos.splice(this.servicos.indexOf(item), 1);
  }
}
