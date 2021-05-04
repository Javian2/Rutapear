import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RutasFavoritasService {

  activarFavoritos:boolean = false;

  constructor(
    private _firestore:AngularFirestore
  ) { }

  postRutaFavorita(ruta_fav){
    this._firestore.collection('rutas_favoritas').add(ruta_fav);
  }

  getRutasFavoritas(id_ruta):Observable<boolean>{

    

    var subject = new Subject<boolean>();



    this._firestore.collection('rutas_favoritas', ref => ref.where('id_usuario_fav', '==', `${localStorage.getItem('user')}`).where('id_ruta_fav', '==', `${id_ruta}`)).snapshotChanges()
      .subscribe(data => {
        
        if(data.length == 0){
          subject.next(false);
        }
        else{
          if(data[0].payload.doc.data()['id_usuario_fav'] != localStorage.getItem('user')){
            subject.next(false);
          }
          else{
            subject.next(true);
          }
        }
      })
      return subject.asObservable();
  }

  borrarRutaFavorita(id_ruta){
    this._firestore.collection('rutas_favoritas', ref => ref.where('id_ruta_fav', '==', `${id_ruta}`).where('id_usuario_fav', '==', `${localStorage.getItem('user')}`)).snapshotChanges()
      .subscribe(data => {
        if(data.length > 0){
          this._firestore.doc(`rutas_favoritas/${data[0].payload.doc.id}`).delete();
        }
      })
  }
}
