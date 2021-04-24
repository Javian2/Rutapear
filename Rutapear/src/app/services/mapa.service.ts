import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  constructor(
    private http:HttpClient
  ) { }



  getCoordenadas(ubicacion:any){
    return this.http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${ubicacion}.json?access_token=pk.eyJ1IjoiamF2aWFuMSIsImEiOiJja252bjYyazUwbzg1MnBta3h3dHd1YXNtIn0._Fho9mjyckruRwt4tQ_kmQ`)
  }

}

