import { Component, OnInit } from '@angular/core';
import { StaticDataService, ProductionService } from '../../services';
import { FieldFilterPipe } from '../../pipes';
import { DecimalPipe } from '@angular/common';
import { Platform } from '@ionic/angular';

import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-man-dashboard',
  templateUrl: './man-dashboard.component.html',
  styleUrls: ['./man-dashboard.component.scss']
})
export class ManDashboardComponent implements OnInit {

  prodSubs: any;
  production: any;
  date: string = moment().add(-1, 'days').format('YYYY-MM-DD');
  dailyProd: any = {};
  staticData: any;
  prodNominal: any;
  prodObj: number;
  secObj: number;

  constructor(
    public platform: Platform,
    private router: Router,
    public staticDataP: StaticDataService,
    public prodData: ProductionService,
    private fieldFilterPipe: FieldFilterPipe,
    private number: DecimalPipe
  ) {
    this.staticData = this.staticDataP.data.produccion;
    this.prodNominal = this.staticData.prodNominal;
    this.prodObj = this.staticData.objectives.prodDiaria;
    this.secObj = this.staticData.objectives.segunda;
  }

  ngOnInit() {
    this.prodSubs = this.prodData.getProductionMeta().subscribe( prod => {
      this.production = prod;
      this.dailyProdObj();
    });
  }

  back() {
    this.date = moment(this.date).add(-1, 'days').format('YYYY-MM-DD');
    this.prodNominal = this.staticData.prodNominal;
    this.dailyProdObj();
  }

  forward() {
    this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
    this.prodNominal = this.staticData.prodNominal;
    this.dailyProdObj();
  }

  dailyProdObj() {
    const filteredArray = this.fieldFilterPipe.transform(this.production, ['date'], [this.date], true);
    const obj = {};
    filteredArray.forEach( value => {
      const item = value.payload.val();
      item['$key'] = value.key;
      if (!obj[item.machine]) {
        obj[item.machine] = {
          logs: [],
          total: {}
        };
        obj[item.machine]['logs'].push(item);
        obj[item.machine]['total'] = {
          prod: +item.prod,
          rep: +item.rep,
          seg: +item.seg,
          broken: +item.broken
        };
      } else {
        obj[item.machine]['logs'].push(item);
        obj[item.machine]['total'].prod += (+item.prod);
        obj[item.machine]['total'].rep += (+item.rep);
        obj[item.machine]['total'].seg += (+item.seg);
        obj[item.machine]['total'].broken += (+item.broken);
      }
    });
    this.dailyProd = obj;
  }

  timeDiff(start: string, end: string) {
    return moment.duration(moment(end, 'HH:mm:ss').diff(moment(start, 'HH:mm:ss')))
    .asHours();
  }

  toSalesUnitViejo(units: Array<any>, dim) {
    if (dim) {
      const eq = this.staticData.equivalences[dim];
      let total = 0;

      units.forEach( item => {
        const itemN = +item;
        total += itemN * eq.conv;
      });
      const total2Deacimal = this.number.transform(total, '1.0-2');
      return `${total2Deacimal} ${eq.unit}`;
    }
  }

  toSalesUnit(units: Array<any>, dim) {
    if (dim) {
      const eq = this.staticData.equivalences[dim];
      let total = 0;

      units.forEach( item => {
        const itemN = +item;
        total += itemN * eq.conv;
      });
      const total2Deacimal = this.number.transform(total, '1.0-2');
      return `${total2Deacimal}`;
    }
  }

  totalSec(rep, seg, broken) {
    const repN = +rep;
    const segN = +seg;
    const brokenN = +broken;

    return repN + segN + brokenN;
  }

  getUnit(dim: string) {
    return this.staticData.equivalences[dim].unit;
  }

  buildCode(form) {
    // tslint:disable-next-line:max-line-length
    return `${this.staticData.codebuilder.drawing[form.drawing]}${this.staticData.codebuilder.color[form.color]}${this.staticData.codebuilder.dim[form.dim]}`;
  }

  getProcesed (item) {
    return Number(item.prod) + Number(item.rep) + Number(item.seg) + Number(item.broken);
  }

  get2daRep (item) {
    return Number(item.rep) + Number(item.seg) + Number(item.broken);
  }

  get2da (item) {
    return Number(item.seg) + Number(item.broken);
  }

  routeLog(key: string) {
    this.router.navigate([`/home/produccion/carga-produccion/${key}`]);
  }

  dangerS(seg) {
    if (Number(seg) > this.secObj) {
      return true;
    } else {
      return false;
    }
  }

  warningS(seg) {
    if ((Number(seg) > (this.secObj - 1)) &&  (Number(seg) < this.secObj)) {
      return true;
    } else {
      return false;
    }
  }

  successP(prod) {
    if (Number(prod) > this.prodObj) {
      return true;
    } else {
      return false;
    }
  }

}
