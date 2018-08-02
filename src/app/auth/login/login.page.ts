import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoggerService } from '../shared/logger.service';

@Component({
  selector: 'app-page-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  quadriImg = './assets/images/quadri.jpg';
  loginForm: FormGroup;
  emailChanged = false;
  passwordChanged = false;
  submitAttempt = false;
  userProfile: any = null;
  loading: any;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private authData: LoggerService
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  loginGoogle () {
    this.authData.signInWithGoogleWeb().then( () => {
      this.router.navigate(['/home']);
    })
    .catch( () => {
      console.log('error en log de google');
    });
  }

  elementChanged(input) {
    const field = input.ngControl.name;
    this[field + 'Changed'] = true;
  }

  loginUser() {
    this.submitAttempt = true;

    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      console.log(this.loginForm.value);
      // this.authData.login(this.loginForm.value.email, this.loginForm.value.password)
      // .then( authData => {
      //   console.log('va a root');
      //   this.loading.dismiss().catch(() => {});
      //   this.router.navigate(['/home']);
      //   // lo de arriba lo saco porque la observable del appcomponent ya lo esta direccionando y poniendo
      //   // el root en tabs cuando el usuario de loguea
      // }, error => {
      //   console.log('hubo un error');
      //   this.loading.dismiss()
      //   .then( async () => {
      //     const alert = await this.alertCtrl.create({
      //       message: error.message,
      //       buttons: [
      //         {
      //           text: 'Ok',
      //           role: 'cancel'
      //         }
      //       ]
      //     });
      //     await alert.present();
      //   })
      //   .catch(() => {});
      // });

      // this.loading = this.loadingCtrl.create({
      //   dismissOnPageChange: true,
      // });
      // this.loading.present();
    }
  }

  logOut2() {
    console.log('logout');
    this.authData.logout();
  }

}
