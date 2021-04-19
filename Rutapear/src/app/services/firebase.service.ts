import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  isLoggedIn:boolean = false;
  error:string = "";

  constructor(
    public firebaseAuth: AngularFireAuth
  ) { }

  async signUp(email: string, password: string){
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then( res => {
        this.isLoggedIn = true;
        localStorage.setItem('user', res.user.uid)
      })
      .catch(err => {
        this.error = err.code;
      })
  }

  async signIn(email: string, password: string){
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then( (res:any) => {
        this.isLoggedIn = true;
        localStorage.setItem('user', res.user.uid)
      })
      .catch(err => {
        this.error = err.code;
      })
  }

  logout(){
    this.firebaseAuth.signOut();
    this.isLoggedIn = false;
    localStorage.removeItem('user');
  }
}
