import { Injectable } from '@angular/core';
import { ApiService } from '../../shared';

@Injectable({
  providedIn: 'root'
})
export class SalesAdmService {

  constructor(
    private apiData: ApiService
  ) { }

  getPendingInvoices() {
    return this.apiData.get('ventas/docs-imp');
  }
}
