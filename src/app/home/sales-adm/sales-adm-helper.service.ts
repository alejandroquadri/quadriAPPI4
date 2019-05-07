import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SalesAdmHelperService {

  constructor(
    private number: DecimalPipe
  ) { }

  buildCalipsoObj(pair: any) {
    const filteredObj = {};
    const array = pair.docs.data;
    const printed = pair.printed;

    array.forEach((doc: any) => {
      // con este 1er if filtro las ya impresas
      if (!printed[doc.numerodocumento]) {
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
            cuit: doc.cuit,
            dni: doc.dni
          };
          filteredObj[doc.numerodocumento].items = [];
          filteredObj[doc.numerodocumento].items.push(doc);
        }
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

  comprobanteId(tipo: string, doc?: string, letra?: string) {
    let id;
    // const docFull = `${doc} ${letra}`;
    switch (tipo) {
      case 'Factura de Venta A':
        id = 1;
        break;

      case 'Factura de Venta B':
        id = 6;
        break;

      case 'Factura de Venta Mostrador A':
        id = 1;
        break;

      case 'Factura de Venta Mostrador B':
        id = 6;
        break;

      case 'Nota de Débito de Venta A':
        id = 2;
        break;

      case 'Nota de Débito de Venta B':
        id = 7;
        break;

      case 'Nota de Crédito de Venta A':
        id = 3;
        break;

      case 'Nota de Crédito de Venta B':
        id = 8;
        break;

      default:
        break;
    }
    return id;
  }

  tipoDocCliente(doc) {
    let tipo;
    if (doc.razSoc === 'Salon de Ventas') {
      tipo = {
        docTipo: 99,
        docNro: 0
      };
    } else if (doc.pos_IVA === 'B') {
      tipo = {
        docTipo: 96,
        docNro: doc.dni
      };
    } else {
      tipo = {
        docTipo: 80,
        docNro: doc.cuit.replace(/-/g, '') // esto para sacar los guiones del cuit
      };
    }
    console.log(tipo);
    return tipo;
  }

  buildLastNumObj(doc: any) {
    const obj = {
      auth: {},
      params: {Auth: {}}
    };
    obj['auth']['key'] = 'Auth';
    obj['auth']['token'] = 'Token';
    obj['auth']['sign'] = 'Sign';
    obj['params']['Auth']['Cuit'] = 30502455652;
    obj['params']['PtoVta'] = 9;
    obj['params']['CbteTipo'] = this.comprobanteId(doc.tipo);

    return obj;
  }

  buildInvoiceAfipObj(doc: any, cbteTipo: number, ptoVta: number, number: number) {
    const today = moment().format('YYYYMMDD');
    const tipocliente = this.tipoDocCliente(doc);
    const obj = {
      auth: {},
      params: {
        'Auth': {},
        'FeCAEReq': {
          'FeCabReq': {},
          'FeDetReq': {
            'FECAEDetRequest': {
              'Tributos': { 'Tributo': {}},
              'Iva': { 'AlicIva': {}}
            }
          }
        }
      }
    }

    obj.auth['key'] = 'Auth';
    obj.auth['token'] = 'Token';
    obj.auth['sign'] = 'Sign';
    obj.params['Auth']['Cuit'] = 30502455652; // cuit nuestro
    obj.params['FeCAEReq']['FeCabReq']['CantReg'] = 1;
    obj.params['FeCAEReq']['FeCabReq']['PtoVta'] = ptoVta;
    obj.params['FeCAEReq']['FeCabReq']['CbteTipo'] = cbteTipo;
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Concepto'] = 1;

    // DocTipo = 99 y DocNro = 0 para cuando es factura B y menor a $5000
    // DocTipo = 80 => CUIT; = 86 => CUIL ; = 96 => DNI
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['DocTipo'] = tipocliente.docTipo;
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['DocNro'] = Number(tipocliente.docNro);

    // sumo uno xq quiero el proximo numero. Es desde - hasta.
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['CbteDesde'] = number + 1;
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['CbteHasta'] = number + 1;

    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['CbteFch'] = today;
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['ImpTotal'] = this.round(doc.totalFinal, 2);
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['ImpTotConc'] = 0; // importe neto no gravado
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['ImpNeto'] = this.round(doc.total, 2);
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['ImpOpEx'] = 0; // importe excento
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['ImpTrib'] = this.round(doc.iibb, 2);
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['ImpIVA'] = this.round(doc.ivaTotal, 2);
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['MonId'] = 'PES';
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['MonCotiz'] = 1;
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Tributos']['Tributo']['Id'] = 7;
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Tributos']['Tributo']['Desc'] = 'Percepción de IIBB';
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Tributos']['Tributo']['BaseImp'] = this.round(doc.total, 2);
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Tributos']['Tributo']['Alic'] = 3;
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Tributos']['Tributo']['Importe'] = this.round(doc.iibb, 2);
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Iva']['AlicIva']['Id'] = 5; // IVA 21%
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Iva']['AlicIva']['BaseImp'] = this.round(doc.total, 2);
    obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Iva']['AlicIva']['Importe'] = this.round(doc.ivaTotal, 2);
    return obj;
  }

  // esta funcion permite evitar lo problemas de redondeo de javascript devolviendo un numero en lugar de string
  // https://www.jacklmoore.com/notes/rounding-in-javascript/
  round(value, decimals) {
    const valueExp: any = value + 'e' + decimals;
    return Number(Math.round(valueExp) + 'e-' + decimals);
  }

}

    // obj.auth['key'] = 'Auth';
    // obj.auth['token'] = 'Token';
    // obj.auth['sign'] = 'Sign';
    // obj.params['Auth']['Cuit'] = 30502455652; // cuit nuestro
    // obj.params['FeCAEReq']['FeCabReq']['CantReg'] = 1;
    // obj.params['FeCAEReq']['FeCabReq']['PtoVta'] = ptoVta;
    // obj.params['FeCAEReq']['FeCabReq']['CbteTipo'] = cbteTipo;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Concepto'] = 1;

    // // DocTipo = 99 y DocNro = 0 para cuando es factura B y menor a $5000
    // // DocTipo = 80 => CUIT; = 86 => CUIL ; = 96 => DNI
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['DocTipo'] = 80;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['DocNro'] = 20302179833;

    // // sumo uno xq quiero el proximo numero. Es desde - hasta.
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['CbteDesde'] = number + 1;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['CbteHasta'] = number + 1;

    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['CbteFch'] = today;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['ImpTotal'] = 186;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['ImpTotConc'] = 0;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['ImpNeto'] = 150;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['ImpOpEx'] = 0;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['ImpTrib'] = 4.5;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['ImpIVA'] = 31.5;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['MonId'] = 'PES';
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['MonCotiz'] = 1;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Tributos']['Tributo']['Id'] = 7;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Tributos']['Tributo']['Desc'] = 'Percepción de IIBB';
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Tributos']['Tributo']['BaseImp'] = 150;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Tributos']['Tributo']['Alic'] = 3;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Tributos']['Tributo']['Importe'] = 4.5;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Iva']['AlicIva']['Id'] = 5;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Iva']['AlicIva']['BaseImp'] = 150;
    // obj.params['FeCAEReq']['FeDetReq']['FECAEDetRequest']['Iva']['AlicIva']['Importe'] = 31.5;
    // return obj;
