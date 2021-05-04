import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { RutasService } from '../../services/rutas.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as moment from 'moment';
import { IonInfiniteScroll, PopoverController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { EstablecimientosPage } from '../establecimientos/establecimientos.page';
import { SelladoService } from '../../services/sellado.service';
import { EstablecimientosService } from '../../services/establecimientos.service';
import { PopoverInfoComponent } from '../../components/popover-info/popover-info.component';
import { Router } from '@angular/router';
import { RutasFavoritasService } from '../../services/rutas-favoritas.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  rutas:any[] = [];
  rutasIds:any[] = [];
  fecha_inicio:string;
  fecha_final:string;
  textoBuscar:string;
  activarHistorico:boolean
  contadorFiltros:number = 0;
  autenticado:boolean

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  constructor(
    private _rutas:RutasService,
    private _firestore:AngularFirestore,
    private _sellado:SelladoService,
    public modalController: ModalController,
    private _establecimientos:EstablecimientosService,
    public popoverController: PopoverController,
    public toastController: ToastController,
    public router:Router,
    private _rutaFavorita:RutasFavoritasService
  ) {}
  

  ionViewDidEnter(){

  


    //BOOLEAN AUTENTICADO

    if(localStorage.getItem('user')){
      this.autenticado = true;
    }
    else{
      this.autenticado = false;
    }
    
    //SI ESTAMOS EN HISTORICOS O RUTAS

    this.rutas = [];
    this.activarHistorico = this._sellado.activarHistorico;


    if(this._sellado.activarHistorico){
      if(this.autenticado){
        this.contadorFiltros = 1;
        this.getHistoricos();
      }
      else{
        this.redireccionarLogin('Inicia sesión para ver tus rutas visitadas');
        this.router.navigate(['/tabs/tab4'])
      }
    }
    else{
      this.contadorFiltros = 0;
      this.getRutas();
    }

  }

  ngOnInit(){
    
  }

  getRutas(){


    this.rutasIds = [];

    this._rutas.getRutas()
      .subscribe(data => {
       
        data.forEach(ruta => {
          var fechaInicial:any = ruta.payload.doc.data()['fecha_inicio'].toDate();
          this.fecha_inicio = moment(fechaInicial).format('l')

          var fechaFinal:any = ruta.payload.doc.data()['fecha_final'].toDate();
          this.fecha_final = moment(fechaFinal).format('l')

            this._rutaFavorita.getRutasFavoritas(ruta.payload.doc.id)
            .subscribe(favorito => {

              if(this.rutasIds.includes(ruta.payload.doc.id) == false){
                this.rutasIds.push(ruta.payload.doc.id);
                this.rutas.push({
                  id: ruta.payload.doc.id,
                  nombre: ruta.payload.doc.data()['nombre'],
                  ubicacion: ruta.payload.doc.data()['ubicacion'],
                  fecha_inicio: this.fecha_inicio,
                  fecha_final: this.fecha_final,
                  imagen: ruta.payload.doc.data()['imagen'],
                  centro: ruta.payload.doc.data()['centro'],
                  favorita: favorito
                })
              }             
            })
        
        });
      })
  }

  getHistoricos(){

    this.rutasIds = [];


    this._rutas.getRutas()
      .subscribe(data => {
        data.forEach(ruta => {
          
          this._establecimientos.getEstablecimientos(ruta.payload.doc.id)
            .subscribe(dataEstablecimiento => {

              var exit = false;

              dataEstablecimiento.forEach(establecimiento => {
              
                this._sellado.getSellados(establecimiento.payload.doc.id)
                  .subscribe(sellado => {
                    
                    if(sellado && !exit){

                      exit = true;

                      var fechaInicial:any = ruta.payload.doc.data()['fecha_inicio'].toDate();
                      this.fecha_inicio = moment(fechaInicial).format('l')

                      var fechaFinal:any = ruta.payload.doc.data()['fecha_final'].toDate();
                      this.fecha_final = moment(fechaFinal).format('l')

                      if(this.rutasIds.includes(ruta.payload.doc.id) == false){
                        this.rutasIds.push(ruta.payload.doc.id);
                        this.rutas.push({
                          id: ruta.payload.doc.id,
                          nombre: ruta.payload.doc.data()['nombre'],
                          ubicacion: ruta.payload.doc.data()['ubicacion'],
                          fecha_inicio: this.fecha_inicio,
                          fecha_final: this.fecha_final,
                          imagen: ruta.payload.doc.data()['imagen'],
                          centro: ruta.payload.doc.data()['centro']
                        })
                      }                    
                    }                
                  })
              });
              //ruta diferente
            })
        });
      })
  }



  buscar(event){
    this.textoBuscar = event.detail.value;
  }

  async abrirEstablecimiento(ruta) {


    const modal = await this.modalController.create({
      component: EstablecimientosPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'ruta': ruta
      }
    });
    return await modal.present();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverInfoComponent,
      componentProps: {
        'activarHistorico': this.activarHistorico
      },
      cssClass: 'popover', 
      event: ev,
      mode: 'ios',
      backdropDismiss: false
      
    });

    if(this.autenticado){
      await popover.present();
    }

    //RECOGER LA INFORMACIÓN DEL POPOVER (TRUE O FALSE DEPENDIENDO DEL CHECKBOX O VACIO)

    const { data } = await popover.onDidDismiss();


    //SI LA DATA NO VIENE VACIA REINICIAMOS PARA LLAMAR A UNA DE LAS DOS

    

    if(data == true || data == false){
      this.rutas = [];
    }
    

    //DEPENDIENDO DE SI EL CHECKBOX ES TRUE O FALSE SE LLAMA A UNA FUNCION U OTRA

    if(data == true){
      this.activarHistorico = true;
      this.contadorFiltros = 1;
      this.getHistoricos();
    }
    if(data == false){
      this.activarHistorico = false;
      this.getRutas();

    }

    
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

  addRutaFavorita(id_ruta){
    
    if(this.autenticado){

      var ruta_fav = {
        id_ruta_fav: id_ruta, 
        id_usuario_fav: localStorage.getItem('user')
      }

      this._rutaFavorita.postRutaFavorita(ruta_fav)

      var index = this.rutasIds.indexOf(id_ruta);
      this.rutas[index].favorita = true;
    }
    else{
      this.redireccionarLogin('Inicia sesión para añadir a favoritos')
      this.router.navigate(['/tabs/tab4'])
    }

    
    
    
  }

  deleteRutaFavorita(id_ruta){

    this._rutaFavorita.borrarRutaFavorita(id_ruta)
    var index = this.rutasIds.indexOf(id_ruta);
    this.rutas[index].favorita = false;
  }
  


 


}
