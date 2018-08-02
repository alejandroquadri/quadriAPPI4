import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
// import { GooglePlus } from '@ionic-native/google-plus';

import { Users } from './users';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  user: Observable<firebase.User>;
  current: any;
  uid: string;
  users: any;

  constructor(
    public afAuth: AngularFireAuth,
    // private googlePlus: GooglePlus
  ) {
    this.user = afAuth.authState;
    this.users = Users;
  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  signInWithGoogleWeb(): Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  // signInWithGoogleDevice(): Promise<any> {
  //   return this.googlePlus.login({
  //     'webClientId': '872720422739-b5ja69fq45q4aevrik24o3j9nfeak8lg.apps.googleusercontent.com',
  //     'offline': true
  //   })
  //   .then( res => {
  //     firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken));
  //   });
  // }

  checkRestriction(area: string, userMail?: string) {
    if (this.current) {
      if (!userMail) { userMail = this.current.email; }
      if (this.users[area].indexOf(userMail) !== -1) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkIfQuadri(userMail: string) {
    const regEx = /@quadri/;
    return regEx.test(userMail);
  }

}
