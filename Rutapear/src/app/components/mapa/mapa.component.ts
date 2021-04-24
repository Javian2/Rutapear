import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MapaService } from '../../services/mapa.service';

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  @Input() establecimientos:any[]
  @Input() establecimientosId: any[]
  @Input() ruta:any

  mapa

  constructor(
    private _mapa:MapaService
  ) { }

  ngOnInit() {
    this.cargarMapa();
  }

  cargarMapa(){
    

    console.log(this.ruta.centro);

    this._mapa.getCoordenadas(this.ruta.centro)
      .subscribe((centro:any) => {
        var latlon:any[] = centro.features[0].center 
        console.log(latlon.reverse())

        //creo el mapa con el centro de la ruta
        
        mapboxgl.accessToken = environment.mapboxKey;
        this.mapa = new mapboxgl.Map({
          container: 'mapa',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: latlon.reverse(),
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

}
