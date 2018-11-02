import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(
    private api: ApiService
  ) { }

  getRevenue(start: string, end: string) {
    return this.api.get(`ventas/ok/${start}/${end}`);
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
