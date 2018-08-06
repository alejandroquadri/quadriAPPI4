import { Router } from '@angular/router';
import { LoadingController, AlertController, MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoggerService } from '../shared/logger.service';
import { SplitService } from './../../shared/services/split.service';

@Component({
  selector: 'app-page-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  quadriImg = './assets/images/LogoQuadri1024.png'; // /Users/alejandroquadri/Dev/quadriAppI4/src/assets/images/Logo Quadri 1024.png
  emailChanged = false;
  passwordChanged = false;
  submitAttempt = false;
  userProfile: any = null;
  public loginForm: FormGroup;
  public loading: HTMLIonLoadingElement;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private authData: LoggerService,
    private splitS: SplitService
  ) {
  }

  ngOnInit() {
    // this.splitS.updateSplitShow(false);
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

  async loginUser(): Promise<void> {
    if (!this.loginForm.valid) {
      console.log('Form is not valid yet, current value:', this.loginForm.value);
    } else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authData.login(email, password)
      .then( () => {
        this.loading.dismiss().then(() => {
          this.loginForm.reset();
          this.router.navigateByUrl('home');
          this.splitS.showChange();
        });
      },
      error => {
        this.loading.dismiss()
        .then(async () => {
          const alert = await this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: 'Ok', role: 'cancel' }],
          });
          await alert.present();
        });
      });

      this.loading = await this.loadingCtrl.create();
      await this.loading.present();
    }
  }

  loginUser2() {
    console.log(this.loginForm);
  }

  logOut2() {
    console.log('logout');
    this.authData.logout();
  }

}
