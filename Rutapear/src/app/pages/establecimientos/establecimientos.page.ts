import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EstablecimientosService } from '../../services/establecimientos.service';

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
  sellado:boolean = false;


  constructor(
    public modalController: ModalController,
    public _establecimientos:EstablecimientosService
  ) { }

  ngOnInit() {
    this._establecimientos.getEstablecimientos(this.ruta.id)
    .subscribe(data => {
      this.establecimientos = data.map(e => {

        //AQUI HACER LA LLAMADA A ESTABLECIMIENTOS

        




        return {
          nombre: e.payload.doc.data()['nombre'],
          foto_tapa: e.payload.doc.data()['foto_tapa'],
          nombre_tapa: e.payload.doc.data()['nombre_tapa']
        }
      })
    })
  }

  cerrarEstablecimiento(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  buscar(event){
    this.textoBuscar = event.detail.value;
  }

  segmentChanged(ev: any) {
    this.valorSegment = ev.detail.value;
  }

}
