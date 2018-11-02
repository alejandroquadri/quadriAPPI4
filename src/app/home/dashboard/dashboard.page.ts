import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../shared';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    private api: ApiService
  ) {
  }

  ngOnInit() {}

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

}
