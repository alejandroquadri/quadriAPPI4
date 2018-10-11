import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared';

import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcurementService {

  sparePartsFc: any;
  spareParts: any;
  filters = {
    completo: false,
    pendiente: true,
    suspendido: false,
    encargado: true,
    autorizacion: true
  };

  searchInput = '';
  field = 'fecha';
  asc = false;

  filterSubject = new ReplaySubject(1);
  filterObs = this.filterSubject.asObservable();

  constructor(
    private api: ApiService,
  ) {
    this.updateFilters();
  }

  pushSparePart(form: any) {
    return this.api.push('repuestos', form);
  }

  getSpareParts() {
    return this.api.getList('repuestos');
  }

  getSparePartsMeta() {
    return this.api.getListMeta('repuestos');
  }

  deleteSparePart(key: string) {
    return this.api.removeItemList('repuestos', key);
  }

  updateSparePart(key: string, form: any) {
    return this.api.updateList('repuestos', key, form);
  }

  updateFilters() {
    this.filterSubject.next(this.filters);
  }

}
