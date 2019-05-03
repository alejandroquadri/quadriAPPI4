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

  afipMock(num) {
    return new Promise( (res, rej) => {
      setTimeout(() => {
        console.log('afip returns');
        res({
          cae: '12345678901234',
          caeFecha: '2018-04-22',
          caeNum: num
        });
      }, 1000);
    })
  }

  nextNumber(tipoDoc) {
    return new Promise( (res, rej) => {
      setTimeout(() => {
        console.log('afip returns number');
        res('0009-23234098');
      }, 500);
    });
  }

  saveDoc(doc: any) {
    return this.apiData.push('sales/printed', doc);
  }

  addPrintedList(number: string) {
    const obj = {};
    obj[number] = true;
    return this.apiData.updateObject('sales/printedNumbers', obj);
  }

  getPrintedDocs() {
    return this.apiData.getList('sales/printed');
  }

  getPrintedNumbers() {
    return this.apiData.getObject('sales/printedNumbers');
  }
}
