import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  constructor(
    private _firestore:AngularFirestore,
  ) { }

  getRutas(){
    return this._firestore.collection('rutas').snapshotChanges();
  }

}
