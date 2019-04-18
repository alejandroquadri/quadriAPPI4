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

  afipMock() {
    return new Promise( (res, rej) => {
      setTimeout(() => {
        console.log('afip returns');
        res({
          cae: '1234823409324',
          num: '0009-23234098'
        });
      }, 1000);
    })
  }
}
