import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SelladoService {

  constructor(
    private _firestore:AngularFirestore,
  ) { }

  selladoService:boolean = false;

  /* getSellados(idEstablecimiento):Observable<boolean>{

    var subject = new Subject<boolean>();

    this._firestore.collection('sellado').snapshotChanges()
      .subscribe(data => {

        data.forEach(sellado => {
          if(localStorage.getItem('user') == sellado.payload.doc.data()['id_usuario']){
            
            if(idEstablecimiento == sellado.payload.doc.data()['id_establecimiento']){
              subject.next(true);
            }
            else{
              subject.next(false);
            }
          }
          else{
            subject.next(false);
          }
          
        });
      })
      
      return subject.asObservable();

  }  */


  getSellados(idEstablecimiento):Observable<boolean>{

    var subject = new Subject<boolean>();

    
    this._firestore.collection('sellado', ref => ref.where('id_establecimiento', '==', `${idEstablecimiento}`).where('id_usuario', '==', `${localStorage.getItem('user')}`)).snapshotChanges()
      .subscribe(data => {
        if(data.length == 0){
          subject.next(false);
        }
        else{
          subject.next(true);
        }
      })
      return subject.asObservable();
  }

  postSellado(sellado){
    this._firestore.collection('sellado').add(sellado);
  }
  

   getEstablecimientos(id){
    return this._firestore.collection(`rutas/${id}/establecimientos`).snapshotChanges();
  }

  

}

