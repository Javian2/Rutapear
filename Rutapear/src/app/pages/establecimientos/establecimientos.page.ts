import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EstablecimientosService } from '../../services/establecimientos.service';
import { SelladoService } from '../../services/sellado.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


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


  constructor(
    public modalController: ModalController,
    public _establecimientos:EstablecimientosService,
    public _sellado:SelladoService,
    public _firestore:AngularFirestore,
    public barcodeScanner:BarcodeScanner
  ) { }


  ngOnInit(){
    this._establecimientos.getEstablecimientos(this.ruta.id)
      .subscribe(data => {
        data.forEach(establecimiento => {
          
          this._sellado.getSellados(establecimiento.payload.doc.id)
            .subscribe(coincide => {
              this.sellado = coincide;

              
              if(this.establecimientosId.includes(establecimiento.payload.doc.id) == false){
                this.establecimientosId.push(establecimiento.payload.doc.id);
                this.establecimientos.push({
                  nombre: establecimiento.payload.doc.data()['nombre'],
                  foto_tapa: establecimiento.payload.doc.data()['foto_tapa'],
                  nombre_tapa: establecimiento.payload.doc.data()['nombre_tapa'],
                  sellado: this.sellado
                })
              }

              
            })
        });
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

  sellarEstablecimiento(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData)
    }).catch(err => {
      console.log('Error', err)
    })
  }

  
}
