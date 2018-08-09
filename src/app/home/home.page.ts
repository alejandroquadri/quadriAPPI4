// import { Component } from '@angular/core';

// @Component({
  //   selector: 'app-page-home',
  //   templateUrl: 'home.page.html',
  //   styleUrls: ['home.page.scss'],
  // })
  // export class HomePage {
    
    //   constructor(
      //   ) {}
      
      // }
      
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LoggerService } from '../auth/shared/logger.service';
import { SplitService } from '../shared';

@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

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
    this.userProfile = this.authData.current;
  }

  ngOnInit() {
    this.disSplitObs = this.splitService.disableObs
    .subscribe( (disable: boolean) => {
      this.disSplit = disable;
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
