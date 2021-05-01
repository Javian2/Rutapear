import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { RutasService } from '../../services/rutas.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as moment from 'moment';
import { IonInfiniteScroll, PopoverController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { EstablecimientosPage } from '../establecimientos/establecimientos.page';
import { SelladoService } from '../../services/sellado.service';
import { EstablecimientosService } from '../../services/establecimientos.service';
import { PopoverInfoComponent } from '../../components/popover-info/popover-info.component';


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

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  constructor(
    private _rutas:RutasService,
    private _firestore:AngularFirestore,
    private _sellado:SelladoService,
    public modalController: ModalController,
    private _establecimientos:EstablecimientosService,
    public popoverController: PopoverController
  ) {}
  

  ionViewDidEnter(){
    
    this.rutas = [];
    this.activarHistorico = this._sellado.activarHistorico;


    if(this._sellado.activarHistorico){
      this.contadorFiltros = 1;
      this.getHistoricos();
    }
    else{
      this.contadorFiltros = 0;
      this.getRutas();
    }
  }

  ngOnInit(){
    
  }

  getRutas(){
    this._rutas.getRutas()
      .subscribe(data => {
        this.rutas = data.map(e => {


          var fechaInicial:any = e.payload.doc.data()['fecha_inicio'].toDate();
          this.fecha_inicio = moment(fechaInicial).format('l')

          var fechaFinal:any = e.payload.doc.data()['fecha_final'].toDate();
          this.fecha_final = moment(fechaFinal).format('l')



          return {
            id: e.payload.doc.id,
            nombre: e.payload.doc.data()['nombre'],
            ubicacion: e.payload.doc.data()['ubicacion'],
            fecha_inicio: this.fecha_inicio,
            fecha_final: this.fecha_final,
            imagen: e.payload.doc.data()['imagen'],
            centro: e.payload.doc.data()['centro']
          }
        })
      })
  }

  getHistoricos(){


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
    await popover.present();

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
  


 


}
