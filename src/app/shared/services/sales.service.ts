import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private facturacionSubject = new BehaviorSubject({});
  public facturacion$ = this.facturacionSubject.asObservable();
  today = moment();

  constructor(
    private api: ApiService
  ) {
    this.buildFacturacionSubject();
  }

  getRevenue(start: string, end: string) {
    return this.api.get(`ventas/facturacion/${start}/${end}`);
  }

  buildFacturacionSubject(start?: string, end?: string) {
    if (!end) { end = this.today.format('YYYYMMDD'); }
    if (!start) { start = this.today.date(1).subtract(6, 'months').format('YYYYMMDD'); }

    this.api.get(`ventas/facturacion/${start}/${end}`)
    .pipe(
      map( (res: any) => res.json())
    )
    .subscribe( facturacion => {
      this.facturacionSubject.next(facturacion);
    });
  }

  getStock() {
    return this.api.get('stock');
  }

  getObjectivesOld() {
    return this.api.get('ventas/objetivos');
  }

  getObjectives() {
    return this.api.getObject('crm/objectives');
  }

}
