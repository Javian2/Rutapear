import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EstablecimientosService } from '../../services/establecimientos.service';
import { SelladoService } from '../../services/sellado.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EstablecimientosFavoritosService } from '../../services/establecimientos-favoritos.service';
import { ValoracionesPage } from '../valoraciones/valoraciones.page';
import { ValoracionesService } from '../../services/valoraciones.service';



@Component({
  selector: 'app-establecimientos',
  templateUrl: './establecimientos.page.html',
  styleUrls: ['./establecimientos.page.scss'],
})
export class EstablecimientosPage implements OnInit {

  @Input() ruta:any

  establecimientos:any[] = []
  textoBuscar:string;
  valorSegment:string = 'lista';
  sellado:any = false;
  establecimientosId:any[] = [];
  autenticado:boolean


  constructor(
    public modalController: ModalController,
    public _establecimientos:EstablecimientosService,
    public _sellado:SelladoService,
    public _firestore:AngularFirestore,
    public barcodeScanner:BarcodeScanner,
    public toastController: ToastController,
    public router:Router,
    private _establecimientosFav:EstablecimientosFavoritosService,
    private _valoraciones:ValoracionesService
  ) { }


  ionViewDidEnter(){


    if(localStorage.getItem('user')){
      this.autenticado = true;
    }
    else{
      this.autenticado = false;
    }
  }

  ngOnInit(){
    this.getEstablecimientos();
  }

  //CIERRA EL MODAL
  cerrarEstablecimiento(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  //BUSCADOR ESTABLECIMIENTOS
  buscar(event){
    this.textoBuscar = event.detail.value;
  }

  //CAMBIA EL SELECTOR
  segmentChanged(ev: any) {
    this.valorSegment = ev.detail.value;
  }


  //FUNCION QUE SELLA EL ESTABLECIMIENTO, CÓDIGO QR
  sellarEstablecimiento(id){

    var options = {
      resultDisplayDuration: 0
    }

    if(localStorage.getItem('user') == null){
      this.modalController.dismiss({
        'dismissed': true
      });
      this.redireccionarLogin('Inicia sesión para sellar el establecimiento');
      this.router.navigate(['/tabs/tab4'])
    }
    else{
      this.barcodeScanner.scan(options).then(qrData => {
        if(qrData.text == id){
          this.qrCorrecto('Establecimiento sellado correctamente')
          //PUSH
  
          var sellado = {
            id_establecimiento: id, 
            id_usuario: localStorage.getItem('user')
          }
  
          this._sellado.postSellado(sellado);

          var index = this.establecimientosId.indexOf(id);
          this.establecimientos[index].sellado = true;
          
        }
        else{
          this.qrIncorrecto('El código QR de este establecimiento es incorrecto')
        }
      }).catch(err => {
        this.qrIncorrecto('Hubo un error')
      })

      
    }
    
      
    
  //MENSAJES INFORMATIVOS
  }

  async qrCorrecto(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      color: 'primary',
      cssClass: 'toastRegistro'
    });
    toast.present();
  }

  async qrIncorrecto(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
      color: 'danger',
      cssClass: 'toastRegistro'
    });
    toast.present();
  }

  async redireccionarLogin(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
      color: 'danger',
      cssClass: 'toastRegistro'
    });
    toast.present();
  }


  //OBTENER ESTABLECIMIENTOS Y SI ESTÁN SELLADOS O NO
  getEstablecimientos(){
    this._establecimientos.getEstablecimientos(this.ruta.id)
      .subscribe(data => {
        data.forEach(establecimiento => {
          
          this._valoraciones.getValoracionMedia(establecimiento.payload.doc.id)
            .subscribe(valoracion => {

              this._establecimientosFav.getEstablecimientosFavoritos(establecimiento.payload.doc.id)
                .subscribe(favorito => {

                  this._sellado.getSellados(establecimiento.payload.doc.id)
                    .subscribe(coincide => {
                      this.sellado = coincide;

                      if(this.establecimientosId.includes(establecimiento.payload.doc.id) == false){
                        this.establecimientosId.push(establecimiento.payload.doc.id);
                        this.establecimientos.push({
                          id: establecimiento.payload.doc.id,
                          nombre: establecimiento.payload.doc.data()['nombre'],
                          foto_tapa: establecimiento.payload.doc.data()['foto_tapa'],
                          nombre_tapa: establecimiento.payload.doc.data()['nombre_tapa'],
                          sellado: this.sellado,
                          ubicacion:establecimiento.payload.doc.data()['ubicacion'],
                          favorito: favorito,
                          valoracion: valoracion
                        })
                      }
                    })
                })
            })          
        });
      })
  }

  postEstablecimientoFavorito(id_establecimiento){
    if(this.autenticado){

      var establecimiento_fav = {
        id_establecimiento_fav: id_establecimiento, 
        id_usuario_fav: localStorage.getItem('user')
      }

      this._establecimientosFav.postEstablecimientoFavorito(establecimiento_fav)

      var index = this.establecimientosId.indexOf(id_establecimiento);
      this.establecimientos[index].favorito = true;
    }
    else{
      this.modalController.dismiss({
        'dismissed': true
      });
      this.redireccionarLogin('Inicia sesión para añadir a favoritos')
      this.router.navigate(['/tabs/tab4'])
    }
  }

  deleteEstablecimientoFavorito(id_establecimiento){

    this._establecimientosFav.borrarEstablecimientoFavorito(id_establecimiento)
    var index = this.establecimientosId.indexOf(id_establecimiento);
    this.establecimientos[index].favorito = false;
  }


  async llamarValoraciones(id_establecimiento) {
    const modal = await this.modalController.create({
      component: ValoracionesPage,
      cssClass: 'estiloValoraciones',
      backdropDismiss: false,
      componentProps: {
        'id_establecimiento': id_establecimiento
      }
    });
    return await modal.present();
  }

  
}
