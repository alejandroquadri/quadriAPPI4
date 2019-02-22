import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoggerService } from '../../auth/shared/logger.service';
import { debounceTime, finalize } from 'rxjs/operators';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';

import { Ng2ImgMaxService } from 'ng2-img-max';

import {
  Plugins, CameraResultType, CameraSource,
  FilesystemDirectory, FilesystemEncoding
} from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public profileForm: FormGroup;
  current: any;
  formChanges$: any;
  avatar: any;
  image: SafeResourceUrl;

  uploadPercent: any;
  downloadURL: any;


  constructor(
    public fb: FormBuilder,
    private auth: LoggerService,
    private sanitizer: DomSanitizer,
    private storage: AngularFireStorage,
    public platform: Platform,
    private ng2ImgMax: Ng2ImgMaxService
  ) {
    }

  ngOnInit() {
    this.current = this.auth.current;
    console.log(this.current);
    this.avatar = this.current.photoURL;
    this.buildForm();
  }

  buildForm() {
    this.profileForm = this.fb.group({
      name: [ this.current.displayName || ''],
      img: ['']
    });
    this.formChanges();
  }

  formChanges() {
    this.formChanges$ = this.profileForm.controls['name'].valueChanges
    .pipe(debounceTime(1000))
    .subscribe( data => {
      this.updateProfile();
    });
  }

  // imageChange() {
  //   this.profileForm.controls['img']
  //   .valueChanges
  //   .subscribe( img => {
  //     console.log(img);
  //     // this.uploadFirebaseSDK(img);
  //     this.uploadAngularFire(img);
  //   });
  // }

  // uploadFile(e) {
  //   console.log(e, e.target.files[0]);
  //   this.uploadAngularFire(e.target.files[0]);
  //   this.setImg(e.target.files[0]);
  // }

  uploadFile(e) {
    console.log(e, e.target.files[0]);
    this.compress(e.target.files[0])
    .subscribe( compImg => {
      console.log('vuelve comprimida', compImg);
      this.uploadAngularFire(compImg);
      this.setImg(compImg);
    },
    error => {
          console.log('😢 Oh no!', error);
    });
  }

  compress(image) {
    // return this.ng2ImgMax.compressImage(image, 0.075);
    return this.ng2ImgMax.resizeImage(image, 10000, 300);
  }

  setImg(file) {
    this.compress(file)
    .subscribe( comprImg => {
      console.log('vuelve imagen');
      const reader = new FileReader();

      reader.onload = (e) => {
        console.log(e);
        this.avatar = reader.result;
      };
      reader.readAsDataURL(comprImg);
    });
  }

  uploadAngularFire(blob) {
    const filePath = `appData/${this.current.uid}`;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, blob);
    this.uploadPercent = task.percentageChanges();

    // get notified when the download URL is available
    task.snapshotChanges()
    .pipe(
      finalize( () => {
      console.log('termino');
      this.downloadURL = fileRef.getDownloadURL();
      this.saveImgUrl();
      })
    ).subscribe();
  }

  saveImgUrl() {
    this.downloadURL
    .subscribe( url => {
      this.avatar = url;
      this.updateProfile();
    });
  }

  updateProfile() {
    this.auth.updateProfile(this.profileForm.value.name, this.avatar);
  }

  // pruebas de camera

  showCamera() {
    console.log('arranca camera');
    const browser = <any>navigator;
    console.log('browser', browser);

    const config = { audio: true, video: true };

    browser.mediaDevices.getUserMedia(config)
    .then((stream) => {
      console.log(stream);
      /* use the stream */
    })
    .catch((err) => {
      console.log(err);
      /* handle the error */
    });
  }



  // async takePicture() {
  //   console.log('arranca');
  //   const { Camera } = Plugins;

  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: true,
  //     // resultType: CameraResultType.Base64,
  //     resultType: CameraResultType.Uri,
  //     source: CameraSource.Camera
  //   });

  //   // Example of using the Base64 return type. It's recommended to use CameraResultType.Uri
  //   // instead for performance reasons when showing large, or a large amount of images.
  //   // this.avatar = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.base64Data));
  //   this.avatar = image.base64Data;
  //   console.log(image);
  //   const blob = this.dataURItoBlob(image.base64Data);
  //   console.log(blob);
  //   // this.uploadImg(blob)
  //   // .then( ret => {
  //   //   console.log(ret);
  //   // });
  //   this.upload(blob);
  // }

  // dataURItoBlob(dataURI) {

  //   const binary = atob( dataURI.split(',')[1]), array = [];
  //   for (let i = 0; i < binary.length; i++) {
  //     array.push(binary.charCodeAt(i));
  //   }
  //   return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  // }

}
