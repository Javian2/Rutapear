import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  mensajeError:string = "";

  constructor(
    private router:Router,
    private _firebase:FirebaseService,
    public toastController: ToastController
  ) { }

  ngOnInit() {
  }

  abrirLogin(){
    this.router.navigate(['/tabs/tab4'])
  }

  async registrar(forma:NgForm){

    await this._firebase.signUp(forma.form.value.email, forma.form.value.password);
    if(this._firebase.isLoggedIn){
      this.toastRegistro();
      this.router.navigate(['/tabs/tab1']);
    }
    else{
      if(this._firebase.error != ""){
        switch (this._firebase.error) {
          case "auth/weak-password":
            this.mensajeError = "La contraseña debe tener al menos 6 caracteres"
            break;
          
          case "auth/invalid-email":
            this.mensajeError = "El email presenta un formato incorrecto";
            break;

          case "auth/email-already-in-use":
            this.mensajeError = "El email ya se encuentra en uso"
        
          default:
            break;
        }
        this.toastShowError(this.mensajeError);
      }
    }
  }

  async toastRegistro() {
    const toast = await this.toastController.create({
      message: 'Se ha registrado correctamente',
      duration: 2000,
      position: 'bottom',
      color: 'primary',
      cssClass: 'toastRegistro'
    });
    toast.present();
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
