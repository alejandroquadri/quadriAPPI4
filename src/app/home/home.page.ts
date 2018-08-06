import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  items: Observable<any[]>;
  date = moment();

  constructor(
    private db: AngularFireDatabase,
  ) {
    this.items = db.list('finance/avion').valueChanges();
  }

}
