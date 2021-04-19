import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientosService {

  constructor(
    private _firestore:AngularFirestore,
  ) { }

  getEstablecimientos(id){
    return this._firestore.collection(`rutas/${id}/establecimientos`).snapshotChanges();
  }

  
}
