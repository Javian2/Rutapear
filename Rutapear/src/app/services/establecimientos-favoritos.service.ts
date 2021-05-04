import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientosFavoritosService {

  constructor(
    private _firestore:AngularFirestore
  ) { }

  getEstablecimientosFavoritos(id_establecimiento):Observable<boolean>{

    var subject = new Subject<boolean>();

    this._firestore.collection('establecimientos_favoritos', ref => ref.where('id_usuario_fav', '==', `${localStorage.getItem('user')}`).where('id_establecimiento_fav', '==', `${id_establecimiento}`)).snapshotChanges()
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

  postEstablecimientoFavorito(establecimiento_fav){
    this._firestore.collection('establecimientos_favoritos').add(establecimiento_fav);
  }

  borrarEstablecimientoFavorito(id_establecimiento){
    this._firestore.collection('establecimientos_favoritos', ref => ref.where('id_establecimiento_fav', '==', `${id_establecimiento}`).where('id_usuario_fav', '==', `${localStorage.getItem('user')}`)).snapshotChanges()
      .subscribe(data => {
        if(data.length > 0){
          this._firestore.doc(`establecimientos_favoritos/${data[0].payload.doc.id}`).delete();
        }
      })
  }
}
