import { Component, OnInit, } from '@angular/core';

import { LoggerService } from '../../auth/shared/logger.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    private loggerS: LoggerService
  ) {
  }

  ngOnInit() {

  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  permission(area: string) {
    return this.loggerS.checkRestriction(area);
  }

}
