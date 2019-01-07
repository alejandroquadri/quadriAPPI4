import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LoggerService } from '../../auth/shared/logger.service';
import { StaticDataService } from './static-data.service';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {

  production: any;
  searchInput = '';
  field = 'date';
  asc = false;

  constructor(
    private api: ApiService,
    private authData: LoggerService,
    public staticData: StaticDataService
  ) { }

  getProduction() {
    return this.api.getList('production');
  }

  getProdLog(key: string) {
    return this.api.getObject(`production/${key}`);
  }

  pushProduction(form: any) {
    form['timestamp'] = this.api.timestamp();
    form['user'] = {
      displayName: this.authData.current.displayName,
      uid: this.authData.current.uid
    };
    return this.api.push('production', form);
  }

  getProductionMeta() {
    return this.api.getListMeta('production');
  }

  getProductionQuery(offset, startKey?) {
    return this.api.getListQuery('production', offset, startKey);
  }

  deleteProduction(key: string) {
    return this.api.removeItemList('production', key);
  }

  updateProduction(key, form) {
    return this.api.updateList('production', key, form);
  }

  setProdStop(prodKey: string, prod: any, stops: Array<any>) {
    console.log(prodKey, prod, stops);
    const timestamp = moment().format();
    const stopForm = {};
    stops.forEach( item => {
      const stop = {
        timestamp: timestamp,
        user: {
          displayName: this.authData.current.displayName,
          uid: this.authData.current.uid
        },
        date: prod.date,
        machine: prod.machine,
        color: prod.color,
        dim: prod.dim,
        drawing: prod.drawing,
        startP: item.startP,
        endP: item.endP,
        cause: item.cause
      };
      const fanObj = this.api.fanOutObject(stop, [`production/${prodKey}/stops`, 'stops'], true);
      Object.assign(stopForm, fanObj);
    });
    // console.log(stopForm);
    return this.api.fanUpdate(stopForm);
  }

  updateProdStop (prodKey: string, prod: any, stops: Array<any>, keys: Array<string>) {
    const stopForm = {};
    stops.forEach( (item, index) => {
      const stop = {
        startP: item.startP,
        endP: item.endP,
        cause: item.cause
      };
      const fanObj = this.api.fanOutObject(stop, [`production/${prodKey}/stops/${keys[index]}`, `stops/${keys[index]}`], false);
      Object.assign(stopForm, fanObj);
    });
    return this.api.fanUpdate(stopForm);
  }

  removeProdStop (keys: Array<string>) {
    const removeObject = {};
    keys.forEach( key => {
      removeObject[`stops/${key}`] = null;
    });
    console.log(removeObject);
    return this.api.fanUpdate(removeObject);
  }

  pushSupply(form) {
    this.api.push('supplies', form);
  }

  nominalCalc(mach, dim, takt, turno: number, almuerzo: number, paradas: number) {
    const equivalences = this.staticData.data.produccion.equivalences;
    if ( takt !== 0) {
      const prodTime = (turno * 60 - almuerzo - paradas) * 60;
      const eq = equivalences[dim].conv;
      if (mach === 'Breton') {
        takt = 60 / (takt / equivalences[dim].convMl);
      }
      const prod = prodTime / takt;
      return prod * eq;
    }
  }

}
