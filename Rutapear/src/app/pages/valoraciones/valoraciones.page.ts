import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ValoracionesService } from '../../services/valoraciones.service';

@Component({
  selector: 'app-valoraciones',
  templateUrl: './valoraciones.page.html',
  styleUrls: ['./valoraciones.page.scss'],
})
export class ValoracionesPage implements OnInit {

  @Input() id_establecimiento;
  @Input() estado

  estrella1:boolean = false;
  estrella2:boolean = false;
  estrella3:boolean = false;
  estrella4:boolean = false;
  estrella5:boolean = false;
  valoracion:number = 0;

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    private _valoraciones:ValoracionesService
  ) { }

  ngOnInit() {
    
  }

  noValorar(){

    if(this.estado){
      this._valoraciones.postValoracion(this.id_establecimiento, -2);
      this.modalController.dismiss(this.estado);
    }
    else{
      this.modalController.dismiss();
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'La valoración es obligatoria',
      color: 'danger',
      duration: 2000,
      cssClass: 'toastRegistro'
    });
    toast.present();
  }

  async presentToastOk() {
    const toast = await this.toastController.create({
      message: 'Valoración realizada',
      color: 'primary',
      duration: 2000,
      cssClass: 'toastRegistro'
    });
    toast.present();
  }


  estiloEstrella(num:number){
    switch (num) {
      case 1:
        this.estrella1 = true;
        this.estrella2 = false;
        this.estrella3 = false;
        this.estrella4 = false;
        this.estrella5 = false;
        this.valoracion = 1;
        break;
      case 2: 
        this.estrella1 = true;
        this.estrella2 = true;
        this.estrella3 = false;
        this.estrella4 = false;
        this.estrella5 = false;
        this.valoracion = 2;
        break;
      case 3: 
        this.estrella1 = true;
        this.estrella2 = true;
        this.estrella3 = true;
        this.estrella4 = false;
        this.estrella5 = false;
        this.valoracion = 3;
        break;
      case 4: 
        this.estrella1 = true;
        this.estrella2 = true;
        this.estrella3 = true;
        this.estrella4 = true;
        this.estrella5 = false;
        this.valoracion = 4;
        break;
      case 5: 
        this.estrella1 = true;
        this.estrella2 = true;
        this.estrella3 = true;
        this.estrella4 = true;
        this.estrella5 = true;
        this.valoracion = 5;
        break;
      default:
        break;
    }
  }

  mandarValoracion(){
    if(this.estrella1 || this.estrella2 || this.estrella3 || this.estrella4 || this.estrella5){
      this._valoraciones.postValoracion(this.id_establecimiento, this.valoracion);
      this.presentToastOk();
      this.modalController.dismiss(this.valoracion);

    }
    else{
      this.presentToast();
    }
  }

}
