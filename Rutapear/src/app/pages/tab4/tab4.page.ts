import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  iniciadoSesion:boolean = false;
  mensajeError:string = "";

  constructor(
    private router: Router,
    public _firebase:FirebaseService,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    
  }

  ionViewDidEnter(){
    if(localStorage.getItem('user')){
      this.iniciadoSesion = true;
    }
    else{
      this.iniciadoSesion = false;
    }
  }



  abrirRegistro(){
    this.router.navigate(['/registro'])
  }

  async iniciarSesion(forma:NgForm){

    

    await this._firebase.signIn(forma.form.value.email, forma.form.value.password);
    if(this._firebase.isLoggedIn){
      this.router.navigate(['/tabs/tab1']);
    }
    else{
      if(this._firebase.error != ""){
        switch (this._firebase.error) {
          case "auth/invalid-email":
            this.mensajeError = "El email presenta un formato incorrecto";
            break;

          case "auth/wrong-password":
            this.mensajeError = "La contraseña o el email es incorrecto"
            break;

          case "auth/user-not-found":
            this.mensajeError = "La contraseña o el email es incorrecto"
            break;
            
          default:
            break;
        }
        this.toastShowError(this.mensajeError);
      }
    }

    
  }

  cerrarSesion(){
    this._firebase.logout();
    this.router.navigate(['/tabs/tab1']);
  }

  async toastShowError(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
      color: 'danger',
      cssClass: 'toastRegistro'
    });
    toast.present();
  }

}
