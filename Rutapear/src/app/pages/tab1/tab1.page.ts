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
  activarHistorico:boolean;
  activarFavoritos:boolean;
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
    public _rutaFavorita:RutasFavoritasService
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
    this.activarFavoritos = this._rutaFavorita.activarFavoritos;


    

    //si estamos en historicos o en favoritos
    if(this._sellado.activarHistorico || this._rutaFavorita.activarFavoritos){

      //si no estamos autenticados
      if(!this.autenticado){
        if(this._sellado.activarHistorico){
          this.redireccionarLogin('Inicia sesión para visualizar tus rutas visitadas')
        }
        else{
          this.redireccionarLogin('Inicia sesión para visualizar tus favoritos')
        }
        this.router.navigate(['/tabs/tab4'])
      }
      //si estamos autenticados
      else{

        //ambos filtros activados
        if(this._sellado.activarHistorico && this._rutaFavorita.activarFavoritos){
          this.contadorFiltros = 2;
          
        }
        //solo un filtro activado
        else{
          //historicos activado
          if(this._sellado.activarHistorico && !this._rutaFavorita.activarFavoritos){
            this.contadorFiltros = 1;
            this.getHistoricos();
            
          }
          //favoritos activado
          else{
            this.contadorFiltros = 1;
            this.getFavoritos();
            
          }
        }
      }

    }
    //página de inicio
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

          this._rutaFavorita.getRutasFavoritas(ruta.payload.doc.id)
            .subscribe(favorito => {
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
                              centro: ruta.payload.doc.data()['centro'],
                              favorita: favorito
                            })
                          }                    
                        }                
                      })
                  });
                  //ruta diferente
                })
            })
        });
      })
  }

  getFavoritos(){
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

              if(favorito){
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
              }
            })       
        });
      })
  }

  getHistoricosFavoritos(){
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

              if(favorito){

                this._establecimientos.getEstablecimientos(ruta.payload.doc.id)
                .subscribe(dataEstablecimiento => {

                  var exit = false;

                  dataEstablecimiento.forEach(establecimiento => {
                  
                    this._sellado.getSellados(establecimiento.payload.doc.id)
                      .subscribe(sellado => {
                        
                        if(sellado && !exit){

                          exit = true;

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
                        }                
                      })
                  });
                  //ruta diferente
                })
                         
              }
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
        'activarHistorico': this.activarHistorico,
        'activarFavoritos': this._rutaFavorita.activarFavoritos
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


    //SI LA DATA NO VIENE VACIA REINICIAMOS PARA LLAMAR A UNA DE LAS TRES

    
    

    if(data){
      this.rutas = []
    }
    

    //DEPENDIENDO DE SI EL CHECKBOX ES TRUE O FALSE SE LLAMA A UNA FUNCION U OTRA

    if(data[0] == true && data[1] == false){
      //historicos TRUE favoritos FALSE

      this.activarHistorico = true;
      this._rutaFavorita.activarFavoritos = false;
      this.contadorFiltros = 1;
      this.getHistoricos();
    }
    if(data[0] == false && data[1] == false){

      //ambos FALSE

      this.activarHistorico = false;
      this._rutaFavorita.activarFavoritos = false;
      this.getRutas();
    }

    if(data[1] == true && data[0] == false){

      this.activarHistorico = false;
      this._rutaFavorita.activarFavoritos = true;
      this.contadorFiltros = 1;
      this.getFavoritos();

      //favoritos TRUE historicos FALSE
    }

    if(data[1] == true && data[0] == true){

      //ambos TRUE

      this.activarHistorico = true;
      this._rutaFavorita.activarFavoritos = true;
      this.contadorFiltros = 2;
      this.getHistoricosFavoritos();

      //ME FALTA AQUÍ HACERME UNA FUNCIÓN QUE ME SAQUE LOS SELLADOS FAVORITOS Y LLAMADLA
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

    if(this._rutaFavorita.activarFavoritos){
      this.rutas.splice(index, 1);
    }
    
  }
  


 


}
