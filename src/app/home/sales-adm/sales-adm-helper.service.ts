import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesAdmHelperService {

  constructor() { }

  buildCalipsoObj(array: any) {
    const filteredObj = {};

    array.forEach((doc: any) => {
        if (filteredObj[doc.numerodocumento]) {
          filteredObj[doc.numerodocumento].total += (+doc.total_importe);
          filteredObj[doc.numerodocumento].items.push(doc);
        } else {
          filteredObj[doc.numerodocumento] = {
            date: doc.fecha_documento,
            num: doc.numerodocumento,
            razSoc: doc.nombredestinatariotr,
            salesRep: doc.nombreoriginantetr,
            total: +doc.total_importe,
            iibb: +doc.iibbtr,
            ivaTotal: +doc.iva,
            totalFinal: +doc.total_transaccion,
            flag: doc.flag,
            tipo: doc.tipo_documento_full,
            pos_IVA: doc.pos_iva,
            tipo_doc: doc.tipo_documento,
            detalle: doc.detalle,
            domicilio: doc.domicilio,
            calle: doc.calle,
            ciudad: doc.ciudad,
            cuit: doc.cuit
          };
          filteredObj[doc.numerodocumento].items = [];
          filteredObj[doc.numerodocumento].items.push(doc);
        }
    });
    return filteredObj;
  }

  buildArray(obj: any) {
    const docs = Object.keys(obj);
    const array = [];

    docs.forEach( doc => {
      array.push(obj[doc]);
    });
    return array;
  }

}
