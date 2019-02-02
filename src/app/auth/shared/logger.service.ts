import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';


import * as firebase from 'firebase/app';
// import { GooglePlus } from '@ionic-native/google-plus';

import { Users } from './users';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  user: Observable<firebase.User>;
  current: any;
  users: any;

  constructor(
    public afAuth: AngularFireAuth,
    // private googlePlus: GooglePlus
  ) {
    this.user = afAuth.authState;
    // this.users = Users;
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

  updateProfile(displayName, photoURL) {

    const profile = {
      displayName: displayName ,
      photoURL: photoURL
    };

    console.log(profile);

    const user = firebase.auth().currentUser;

    user.updateProfile(profile).then(() => {
      console.log('updated profile');
    }).catch( (error) => {
      console.log('updat profile error', error);
    });
  }

  signInWithGoogleWeb(): Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

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
