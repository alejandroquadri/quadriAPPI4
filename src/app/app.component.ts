import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LoggerService } from './auth/shared/logger.service';
import { SplitService, ServiceWorkerService } from './shared';

import { ToastController } from '@ionic/angular';
import { CrmService } from './home/crm/shared';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  userProfile: any;
  disSplitObs: any;
  disSplit = true;

  update$: any;

  constructor(
    private platform: Platform,
    private authData: LoggerService,
    public splitService: SplitService,
    private swService: ServiceWorkerService,
    private crmData: CrmService,
    public toastCtrl: ToastController
    ) {
    this.initializeApp();
    this.swService.checkForUpdates();
    this.update();
    this.crmData.subscribeToCalipsoDocs();
  }

  ngOnInit() {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authData.user.subscribe( user => {
        this.userProfile = user;
      });
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
  }

  logOut() {
    this.authData.logout();
  }

  changeShow() {
    this.splitService.updateSplitShow();
  }

  shouldShow() {
    if (this.disSplit === true) {
      return 'lg';
    } else {
      return false;
    }
  }

  permission(area: string) {
    return this.authData.checkRestriction(area, this.userProfile.email);
  }

  update() {
    this.update$ = this.swService.update$;
    this.update$.subscribe( ret => {
      console.log('llamo a toast hay actualizacion');
      if (ret) {
        this.presentToast();
      }
    });
  }

  async presentToast() {
    console.log('presento toast');
    const toast = await this.toastCtrl.create({
      message: 'Click para actualizar nueva version',
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Actualizar'
    });
    toast.present();
    toast.onDidDismiss()
    .then( () => {
      this.swService.updateVersion();
    });
  }
}
