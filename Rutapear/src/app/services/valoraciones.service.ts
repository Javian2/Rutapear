import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValoracionesService {

  constructor(
    public _firestore:AngularFirestore
  ) { }

  postValoracion(id_establecimiento, valoracion){
    var valoracion:any = {
      id_establecimiento: id_establecimiento,
      id_usuario: localStorage.getItem('user'),
      valoracion: valoracion
    }
    this._firestore.collection('valoraciones_establecimientos').add(valoracion);
  }

  getValoracionMedia(id_establecimiento):Observable<any>{

    var respuesta = new Subject<any>();
    var valoracionMedia:number = 0;
    var numValoraciones:number = 0;


    this._firestore.collection('valoraciones_establecimientos', ref => ref.where('id_establecimiento', '==', id_establecimiento))
      .snapshotChanges()
        .subscribe(data => {
          numValoraciones = data.length;
          data.forEach(valoraciones => {
            valoracionMedia += valoraciones.payload.doc.data()['valoracion']
          });

          if(numValoraciones == 0){
            valoracionMedia = 0
          }
          else{
            valoracionMedia = valoracionMedia / numValoraciones;
            valoracionMedia = Math.round(valoracionMedia*10)/10
          }

          respuesta.next([valoracionMedia, numValoraciones]); 
        })

        return respuesta.asObservable();
  }

  

}


