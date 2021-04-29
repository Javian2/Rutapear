import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MapaService } from '../../services/mapa.service';
import { ModalController, ToastController } from '@ionic/angular';
import { EstablecimientosService } from '../../services/establecimientos.service';
import { SelladoService } from '../../services/sellado.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  @Input() establecimientos:any[]
  @Input() establecimientosId: any[]
  @Input() ruta:any

  booleanPopup:boolean = false;
  variablePopup:boolean = false;

  datosEstablecimiento:any

  mapa
  geocoder

  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  constructor(
    private _mapa:MapaService,
    public modalController: ModalController,
    public _establecimientos:EstablecimientosService,
    public _sellado:SelladoService,
    public _firestore:AngularFirestore,
    public barcodeScanner:BarcodeScanner,
    public toastController: ToastController,
    public router:Router
  ) { }

  ngOnInit() {
    this.cargarMapa();
    this.addCentro();
    this.addMarcadores();
    /* this.addGeocoder(); */
  }

  cargarMapa(){
    
    mapboxgl.accessToken = environment.mapboxKey;

    this.mapa = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
    });
  }

  addCentro(){
    this._mapa.getCoordenadas(this.ruta.centro)
      .subscribe((centro:any) => {
        var latlon:any[] = centro.features[0].center 

        //creo el mapa con el centro de la ruta
        
        mapboxgl.accessToken = environment.mapboxKey;
        this.mapa = new mapboxgl.Map({
          container: 'mapa',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: latlon,
          zoom: 15
        });

        //trasladar a mi posición

        this.mapa.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true
          })
        );

        
      })
  }

  irCentro(){

    this._mapa.getCoordenadas(this.ruta.centro)
      .subscribe((centro:any) => {
        var latlon:any[] = centro.features[0].center

        this.mapa.flyTo({
          center: latlon,
          zoom: 15,
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
      })

    
  }



  addMarcadores(){

    
    this.establecimientos.forEach(establecimiento => {

    
      this._mapa.getCoordenadas(establecimiento.ubicacion, this.ruta.ubicacion)
        .subscribe((ubi:any) => {

          var latlon:any[] = ubi.features[0].center

          const marker = new mapboxgl.Marker({
            /* color: '#7D625D', */
            color: 'red'
          })
            .setLngLat(latlon)
            .addTo(this.mapa)


          marker.getElement().addEventListener('click', () => {

            this.booleanPopup = !this.booleanPopup;
            this.datosEstablecimiento = establecimiento;

            /* console.log(this.variablePopup);

            if(this.variablePopup == false){
              this.booleanPopup = true;
              this.datosEstablecimiento = establecimiento;

              if(this.booleanPopup){
                marker.getElement().querySelectorAll('svg g[fill="' + marker._color + '"]')[0].setAttribute("fill", 'blue');
                marker._color = 'blue'
                this.variablePopup = true;
              }
              else{
                marker.getElement().querySelectorAll('svg g[fill="' + marker._color + '"]')[0].setAttribute("fill", 'red');
                marker._color = 'red'
              }
            } */
            


  
            
          })
        
        })
    });

  
  }

  /* addGeocoder(){
    this.mapa.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );
  } */

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

  


 



    

    
}


