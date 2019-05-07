import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ApiService } from '../../shared';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesAdmService {

  afipUrl = 'http://localhost:3000/api/';

  constructor(
    private apiData: ApiService,
    public http: Http
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

  nextNumberMock(tipoDoc) {
    return new Promise( (res, rej) => {
      setTimeout(() => {
        console.log('afip returns number');
        res('0009-23234098');
      }, 500);
    });
  }

  getAfipNumber(body) {
    const endpoint = 'wsfev1/FECompUltimoAutorizado';
    return this.http.post(`${this.afipUrl}${endpoint}`, body)
    .pipe(
      map( (res: any) => res.json())
    )
    .toPromise();
  }

  getAfipCae(body) {
    const endpoint = 'wsfev1/FECAESolicitar';
    return this.http.post(`${this.afipUrl}${endpoint}`, body)
    .pipe(
      map( (res: any) => res.json())
    )
    .toPromise();
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
