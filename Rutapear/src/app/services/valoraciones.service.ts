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
          /* numValoraciones = data.length; */
          data.forEach(valoraciones => {
            if(valoraciones.payload.doc.data()['valoracion'] != -2){
              valoracionMedia += valoraciones.payload.doc.data()['valoracion']
              numValoraciones++;
            }
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

  getValorado(id_establecimiento){
    var subject = new Subject<number>();

    this._firestore.collection('valoraciones_establecimientos', ref => ref.where('id_usuario', '==', `${localStorage.getItem('user')}`).where('id_establecimiento', '==', `${id_establecimiento}`)).snapshotChanges()
      .subscribe(data => {

        
        if(data.length == 0){
          subject.next(-1);
        }
        else{
          if(data[0].payload.doc.data()['id_usuario'] != localStorage.getItem('user')){
            subject.next(-1);
          }
          else{
            
            subject.next(data[0].payload.doc.data()['valoracion']);
          }
        }
      })
      return subject.asObservable();
  }

  

}


