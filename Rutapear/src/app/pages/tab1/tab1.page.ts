import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { RutasService } from '../../services/rutas.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as moment from 'moment';
import { IonInfiniteScroll } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { EstablecimientosPage } from '../establecimientos/establecimientos.page';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  rutas:any[] = [];
  fecha_inicio:string;
  fecha_final:string;
  textoBuscar:string;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  constructor(
    private _rutas:RutasService,
    private _firestore:AngularFirestore,
    public modalController: ModalController
  ) {}

  ionViewDidEnter(){

  }

  ngOnInit(){
    this.getRutas();
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
  


 


}
