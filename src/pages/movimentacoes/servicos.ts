import {Component} from "@angular/core";
import { Events, LoadingController, NavController,AlertController, ToastController} from "ionic-angular";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { SMS } from '@ionic-native/sms';
import {ServicoService} from "../../services/servico-service";
import {ServicoDetailPage} from "../movimentacoes/servico-detail";
import {Storage} from '@ionic/storage';
import * as _ from 'underscore';
import * as moment from 'moment';
import { AndroidPermissions } from '@ionic-native/android-permissions';

export class NovoServico {   
    nomeCliente: string;
    placa: string;
    celular: string;
    tipoServico: string;
    observacao: string;
}

@Component({
  selector: 'page-servicos',
  templateUrl: 'servicos.html'
})

export class ServicosPage {  
  public servicos: any;
  public configuracoes: any;
  public situacoes: any;
  public servicosPorSituacoes: any; 
  public somenteDiaAtual: any = true;
  
  public novoServico: NovoServico = {
    nomeCliente: '',
    placa: '',
    celular: '',
    tipoServico: '',
    observacao: ''
  }; 

  constructor(public nav: NavController, public servicoService: ServicoService, public loadingController: LoadingController,
    public forgotCtrl: AlertController, public toastCtrl: ToastController, private storage: Storage, public events: Events,
    public iab: InAppBrowser, private sms: SMS, private androidPermissions: AndroidPermissions) {
    this.getConfiguracoes();    
    this.getServicos();    

    this.events.subscribe('updateServico', () => {
      this.getServicos();      
    });
  }

  criarServico() : NovoServico {
    return new NovoServico;    
  }

  alterarCorData(item) {
    var now = moment();
    var dataAtual = moment(now.format(), [moment.ISO_8601]).format("DD/MM");   

    var unixDate = parseInt(item.dataHoraEntrada);
    var dataEntrada = moment(unixDate).format('DD/MM');

    if (dataEntrada != dataAtual) {
      return "dataPassada";
    }
  }

  verificaServicosPorDia() {
    var now = moment();
    var dataAtual = moment(now.format(), [moment.ISO_8601]).format("DD/MM");    
    if (this.somenteDiaAtual) {
      this.servicos = _.filter(this.servicos, function(item)  { 
        var unixDate = parseInt(item.dataHoraEntrada);     
        var dataEntrada = moment(unixDate).format('DD/MM');
        return dataEntrada == dataAtual;
      });
    } 
  }

  // enum: ['Fila', 'Atendimento', 'Finalizado', 'Pago', 'Outros'],
  servicosPorSituacao(situacao) {
    return _.where(this.servicos, { situacao: situacao });
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
          this.situacoes = _.sortBy(_.uniq(
            _.pluck(this.servicos, 'situacao'), function(situacao) { 
              return situacao; 
            }
          ), _.identity);

          this.verificaServicosPorDia();
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

  getConfiguracoes() {    
    let loader = this.loadingController.create({
      content: "carregando configurações, aguarde..."
    });  
    loader.present();

    this.storage.get('profile').then((val) => {
      this.servicoService.getConfiguracoes(val.token)
      .subscribe(
        (res) => {           
          this.configuracoes = res;
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

  alterarSituacao(servico, situacao) {
    let loader = this.loadingController.create({
      content: "enviando ao servidor, aguarde..."
    });  
    loader.present();

    this.storage.get('profile').then((val) => {
      this.servicoService.alteraSituacao(val.token, servico, situacao)
      .subscribe(
        (res) => {
          /*let toast = this.toastCtrl.create({
              message: "situação alterada para " + situacao.toLowerCase(),
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();*/
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
          this.events.publish('updateServico');
          loader.dismiss();
          this.nav.pop();          
        }
      );
    });       
  }

  doInserirServico() {
    this.novoServico = this.criarServico();
    this.nav.push(ServicoDetailPage, { servico: this.novoServico });
  }

  // view trip detail
  viewDetail(servico) {
    this.nav.push(ServicoDetailPage, {servico: servico});
  }

  finalizarWhatsApp(cliente) {
    // https://api.whatsapp.com/send?phone=5544988282045&text=oiii
    this.alterarSituacao(cliente, 'Finalizado');
    var mensagem = _.findWhere(this.configuracoes, { nome: "SMS_FINALIZADO"});

    
    var numeroCelular = "55" + cliente.celular.replace(/\D+/g, '');
    const browser = this.iab.create('https://api.whatsapp.com/send?phone=' + numeroCelular + '&text=' + 
      encodeURI(this.converteTexto(cliente, mensagem.valor)));
    browser.show();
  }

  enviarSMS(cliente) {
    var mensagem = _.findWhere(this.configuracoes, { nome: "SMS_FINALIZADO"});
    var numeroCelular = "+55" + cliente.celular.replace(/\D+/g, '');
    var options = {
            replaceLineBreaks: true,
            android: {
                intent: 'INTENT' 
            }
        };

    this.sms.send(numeroCelular, this.converteTexto(cliente, mensagem.valor), options)
      .then((res)=>{
        let toast = this.toastCtrl.create({
          message: "sms enviado para " + numeroCelular,
          duration: 3000,
          position: 'top',
          cssClass: 'dark-trans',
          closeButtonText: 'OK',
          showCloseButton: true
        });
        toast.present();   
      },(err)=>{
        alert("falha no envio: " + err);
      });
  }

  finalizarSMS(cliente) {    
    this.alterarSituacao(cliente, 'Finalizado');    

    // pra testar no browse
    //this.enviarSMS(cliente);
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
      result => {
        if (result.hasPermission) {
          this.enviarSMS(cliente);
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
            result => {
              this.enviarSMS(cliente);
          });  
        }
      },
      err => { 
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
          result => {
            this.enviarSMS(cliente);
        });
      }
    );   
  }
 
  doFinalizarServico(item) {
    if (item.situacao === 'Finalizado') {
     let alert = this.forgotCtrl.create({
        title: 'dinheiro',
        inputs: [
          {
            name: 'valorRecebido',
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
              item.valorRecebido = data.valorRecebido;
              item.tipoPagamento = 'Dinheiro';
              this.alterarSituacao(item, 'Pago');
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
              this.alterarSituacao(item, 'Finalizado');
            }
          },
          {
            text: 'WhatsApp',
            handler: data => {
              item.celular = data.celular;      
              this.finalizarWhatsApp(item);
            }
          },
          {
            text: 'SMS',
            handler: data => {
              item.celular = data.celular;
              this.finalizarSMS(item);
            }
          }
        ]
      });
      forgot.present();
    }
  }

  converteTexto(cliente, texto) {
    if (texto == undefined || texto == null || texto == '') 
      texto = "Ola %nome%, já finalizamos o serviço e já pode ser retirado o seu veiculo, muito obrigado";
    var novoTexto = texto.replace("%nome%", cliente.nomeCliente);
    novoTexto = novoTexto.replace("%placa%", cliente.placa);
    novoTexto = novoTexto.replace("%servico%", cliente.tipoServico);
    
    return novoTexto;
  }
}
