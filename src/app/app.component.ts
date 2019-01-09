import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LoggerService } from './auth/shared/logger.service';
import { SplitService, ServiceWorkerService } from './shared';

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

  constructor(
    private platform: Platform,
    private authData: LoggerService,
    public splitService: SplitService,
    private swService: ServiceWorkerService
  ) {
    this.initializeApp();
    this.swService.checkForUpdates();
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
}
