import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Platform } from '@ionic/angular';
import { StaticDataService, ProductionService, SortPipe } from '../../../shared';

@Component({
  selector: 'app-man-sign',
  templateUrl: './man-sign.component.html',
  styleUrls: ['./man-sign.component.scss']
})
export class ManSignComponent implements OnInit {

  prodSubs: any;
  production: any;
  date = moment();
  prodObj: any;
  m2total = 0;
  mltotal = 0;
  staticData: any;

  constructor(
    public platform: Platform,
    private staticDataP: StaticDataService,
    private prodData: ProductionService,
    private sortPipe: SortPipe
  ) {
    this.staticData = this.staticDataP.data.produccion;
  }

  ngOnInit() {
    this.prodSubs = this.prodData.getProduction().subscribe( prod => {
      this.production = prod;
      this.fileterProd();
    });
  }

  fileterProd() {
    const month = `${this.date.format('M')}-${this.date.format('Y')}`;
    this.prodObj = {};
    this.m2total = 0;
    this.mltotal = 0;

    const filtered: Array<any> = this.production.filter( log => {
      const date = `${moment(log.date).format('M')}-${moment(log.date).format('Y')}`;
      if ( date === month &&
        (log.machine === 'Breton' ||
        log.machine === 'Lineal' ||
        log.machine === 'Pasado tablas' ||
        log.machine === 'Biseladora zocalos' ||
        log.machine === 'Desmolde' ||
        log.machine === 'Granalladora' ||
        log.machine === 'Biseladora')
        ) {
        return true;
      }
    });

    const filteredSorted = this.sortPipe.transform(filtered, 'date', true, false);

    filteredSorted.forEach( log => {
      let m2 = 0;
      let ml = 0;
      const prod = this.toSalesUnit(log.prod, log.dim);
      const date = moment(log.date).format('DD/MM/YYYY');

      if (this.staticData.equivalences[log.dim].unit === 'm2') {
        m2 = prod;
        this.m2total += prod;
      } else {
        ml = prod;
        this.mltotal += prod;
      }

      if (!this.prodObj[date]) {
        this.prodObj[date] = {
          m2: m2,
          ml: ml
        };
      } else {
        this.prodObj[date].m2 += m2;
        this.prodObj[date].ml += ml;
      }
    });
  }

  toSalesUnit(unit: string, dim) {
    const eq = this.staticData.equivalences[dim];
    let total = 0;
    const itemN = +unit;
    total += itemN * eq.conv;
    return total;
  }

  premio() {
    if (this.m2total > 5000 ) {
      return (this.m2total - 5000) * this.staticData.premioProd.factorM2 + this.mltotal*this.staticData.premioProd.factorMl;
    } else {
      return 0;
    }
  }

  addMonth() {
    this.date = moment(this.date).add(1, 'months');
    this.fileterProd();
  }

  subMonth() {
    this.date = moment(this.date).subtract(1, 'months');
    this.fileterProd();
  }

}
