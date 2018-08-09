import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoggerService } from './auth/shared/logger.service';
import { SplitService } from './shared/services/split.service';

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
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private authData: LoggerService,
    public splitService: SplitService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    // this.disSplitObs = this.splitService.disableObs
    // .subscribe( (disable: boolean) => {
    //   this.disSplit = disable;
    // });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authData.user.subscribe( user => {
        this.userProfile = user;
      })
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
