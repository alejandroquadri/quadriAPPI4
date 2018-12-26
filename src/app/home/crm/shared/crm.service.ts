import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import * as moment from 'moment';
import { ApiService } from '../../../shared';
import { LoggerService } from '../../../auth/shared/logger.service';

@Injectable({
  providedIn: 'root'
})
export class CrmService {

  calipsoSubs: any;
  checkedPspSubs: any;
  checkedPspObj: any;
  staticData: any;
  statusOptions: any;
  actions: any;
  salesReps: any;
  clientTypes: any;
  filters: any;
  currentSalesRep = '';

  private calipsoObjSubject = new BehaviorSubject({});
  public calipsoObj = this.calipsoObjSubject.asObservable();

  filterSubject = new ReplaySubject(1);
  filterObs = this.filterSubject.asObservable();

  constructor(
    private apiData: ApiService,
    // private apiData: ApiDataProvider,
    private authData: LoggerService,
  ) {
    this.subscribeToCalipsoDocs();
    this.updateFilters();
   }

  subscribeToCalipsoDocs() {
    this.calipsoSubs = this.getDocs()
    .pipe(
      map( (res: any) => res.json())
    )
    .subscribe( docs => {
      this.buildCalipsoObj(docs.data);
    });
  }

  currentSalesRepCheck(): string {
    const mail = this.authData.current.email;
    let name: string;
    switch (mail) {
      case 'alejandraroldan@quadri.com.ar':
        name = 'Alejandra Roldan';
        break;

      case 'albertotarruella@quadri.com.ar':
        name = 'Tarruella Alberto Horacio ';
        break;

      default:
        name = '';
        break;
    }
    return name;
  }

  buildCalipsoObj(array: any) {
    const filteredObj = {
      np: {},
      psp: {},
      invoice: {}
    };

    array.forEach((doc: any) => {
      if (doc.descripcion === 'Presupuesto de Venta') {
        if (filteredObj.psp[doc.numerodocumento]) {
          filteredObj.psp[doc.numerodocumento].total += (+doc.total_importe);
          filteredObj.psp[doc.numerodocumento].items.push(doc);
        } else {
          filteredObj.psp[doc.numerodocumento] = {
            date: doc.fecha_documento,
            num: doc.numerodocumento,
            razSoc: doc.nombredestinatariotr,
            salesRep: doc.nombreoriginantetr,
            total: +doc.total_importe,
            iibb: +doc.iibbtr,
            ivaTotal: +doc.iva,
            totalFinal: +doc.total_transaccion,
            flag: doc.flag
          };
          filteredObj.psp[doc.numerodocumento].items = [];
          filteredObj.psp[doc.numerodocumento].items.push(doc);
        }
      }
    });
    this.calipsoObjSubject.next(filteredObj);
  }

  buildCloseMonth(subsMonths?: number) {
    const months = [];
    let today;
    subsMonths ? today = moment() : today = moment().subtract(subsMonths, 'months');

    for (let i = 0; i < 24; i++) {
      const item = today.clone().add(i, 'month').format('YYYY-MM');
      months.push(item);
    }
    return months;
  }

  getDocs() {
    return this.apiData.get('ventas/docs');
  }

  getCheckedPsp() {
    return this.apiData.getObject('crm/checkPsp');
  }

  getOpsList() {
    return this.apiData.getListMeta('crm/op');
  }

  getOpsListSimple() {
    return this.apiData.getList('crm/op');
  }

  getOp(key) {
    return this.apiData.getObject(`crm/op/${key}`);
  }

  getOpObject() {
    return this.apiData.getObject('crm/op');
  }

  getClients() {
    return this.apiData.getListMeta('crm/clients');
  }

  getClientsObj() {
    return this.apiData.getObject('crm/clients');
  }

  getClient(key: string) {
    return this.apiData.getObject(`crm/clients/${key}`);
  }

  getAgendaObj() {
    return this.apiData.getObject('crm/agenda');
  }

  getAgendaList() {
    return this.apiData.getListMeta('crm/agenda');
  }

  getContactObj() {
    return this.apiData.getObject('crm/contacts');
  }

  getPrices() {
    return this.apiData.get('ventas/precios');
  }

  ignorePsp(psp: string) {
    const form = {};
    form[psp] = 'ignored';
    return this.apiData.updateObject('crm/checkPsp', form);
  }

  saveNewOp(opForm: any, clientForm: any, psp?: any, razSoc?: string, opKey?: string, cliKey?: string) {
    // console.log('llega', opForm, clientForm, psp, razSoc, opKey, cliKey);
    return new Promise((resolve, reject) => {

      let razSocObj;
      let checkPsp;
      if (!opKey) { opKey = this.apiData.getNewKey(); }
      if (!cliKey) { cliKey = this.apiData.getNewKey(); }
      if (!clientForm['ops']) { clientForm['ops'] = {}; }

      clientForm['ops'][opKey] = true;
      opForm['clientKey'] = cliKey;

      const oportunity = this.apiData.fanOutObject(opForm, [`crm/op/${opKey}`], false);
      const client = this.apiData.fanOutObject(clientForm, [`crm/clients/${cliKey}`], false);
      if (psp) {
        checkPsp = this.apiData.fanOutObject(psp, [`crm/checkPsp`], false);
      } else {
        checkPsp = {};
      }
      if (razSoc) {
        razSocObj = this.apiData.fanOutObject(razSoc, [`crm/razSoc`], true);
      } else {
        razSocObj = {};
      }
      const updateObj = Object.assign({}, oportunity, client, checkPsp, razSocObj);
      // console.log(updateObj);
      this.apiData.fanUpdate(updateObj)
      .then( () => {
        opForm['$key'] = opKey;
        resolve(opForm);
      });

    });
  }

  newClient(client) {
    return this.apiData.push('crm/client', client);
  }

  newAgendaNote(agenda) {
    console.log(agenda);
    const agendaKey = this.apiData.getNewKey();
    let opUpdate;
    const agendaLog = this.apiData.fanOutObject(agenda, [`crm/agenda/${agendaKey}`], false);

    if (agenda.opKey) {
      const opAgenda = {};
      opAgenda[agendaKey] = true;
      opUpdate = this.apiData.fanOutObject(opAgenda, [`crm/op/${agenda.opKey}/agenda`], false);
    }
    const updateObj = Object.assign({}, agendaLog, opUpdate);
    return this.apiData.fanUpdate(updateObj);
  }

  razSoc(key, client) {
    const form = {};
    form[key] = client;
    return this.apiData.updateObject('crm/razSoc', form);
  }

  checkPsp(psp) {
    const form = {};
    form[psp] = true;
    return this.apiData.updateObject('crm/checkPsp', form);
  }

  newContact(contact) {
    const contactKey = this.apiData.getNewKey();
    const clientContact = {};
    clientContact[contactKey] = true;

    const contacts = this.apiData.fanOutObject(contact, [`crm/contacts/${contactKey}`], false);
    const clientUpdate = this.apiData.fanOutObject(clientContact, [`crm/clients/${contact.clientKey}/contacts`], false);
    const updateObj = Object.assign({}, contacts, clientUpdate);
    // console.log(updateObj);
    return this.apiData.fanUpdate(updateObj);
  }

  changeClient(newName: string, oldClientKey: string, opKey: string, newClientKey?: string) {
    let updateObj;
    let opForm;

    if (!newClientKey) { newClientKey = this.apiData.getNewKey(); }

    opForm = {
      client: newName,
      clientKey: newClientKey
    };

    updateObj = this.apiData.fanOutObject(opForm, [`crm/op/${opKey}`], false);
    updateObj[`crm/clients/${oldClientKey}/ops/${opKey}`] = null;
    updateObj[`crm/clients/${newClientKey}/ops/${opKey}`] = true;
    updateObj[`crm/clients/${newClientKey}/name`] = newName;

    this.apiData.fanUpdate(updateObj);
  }

  editClientName(newName: string, clientForm: any, clientKey: string) {
    console.log(newName, clientForm, clientKey);
    const clientObj = {};
    const opsArray = Object.keys(clientForm.ops);
    const pathArray = [];

    opsArray.forEach( op => {
      pathArray.push(`crm/op/${op}`);
    });
    console.log(pathArray);
    const opsObj = this.apiData.fanOutObject({'client': newName}, pathArray, false);

    clientObj[`crm/clients/${clientKey}/name`] = newName;

    const updateObj = Object.assign(clientObj, opsObj);
    console.log(updateObj);
    this.apiData.fanUpdate(updateObj);
  }

  updateOp(key: string, form: any) {
    return this.apiData.updateList('crm/op', key, form);
  }

  updateClient(key: string, form: any) {
    return this.apiData.updateList('crm/clients', key, form);
  }

  updateAgendaItem(key: string, form: any) {
    return this.apiData.updateList('crm/agenda', key, form);
  }

  editAgendaItem(agendaForm, agendaKey: string) {
    let opUpdate;
    const agendaLog = this.apiData.fanOutObject(agendaForm, [`crm/agenda/${agendaKey}`], false);

    if (agendaForm.opKey) {
      const opAgenda = {};
      opAgenda[agendaKey] = true;
      opUpdate = this.apiData.fanOutObject(opAgenda, [`crm/op/${agendaForm.opKey}/agenda`], false);
    }
    const updateObj = Object.assign({}, agendaLog, opUpdate);
    return this.apiData.fanUpdate(updateObj);
  }

  updateContact(key: string, form: any) {
    return this.apiData.updateList('crm/contacts', key, form);
  }

  updateFilters() {
    this.filterSubject.next(this.filters);
  }

  delteAgendaItem(agendaKey: string, opKey?) {
    const deleteObj = {};
    deleteObj[`crm/agenda/${agendaKey}`] = null;
    // tslint:disable-next-line:no-unused-expression
    opKey ? deleteObj[`crm/op/${opKey}/agenda/${agendaKey}`] = null : '';
    return this.apiData.fanUpdate(deleteObj);
  }

  deleteContact(contactKey: string, clientKey: string) {
    const deleteObj = {};
    deleteObj[`crm/contacts/${contactKey}`] = null;
    deleteObj[`crm/clients/${clientKey}/contacts/${contactKey}`] = null;
    return this.apiData.fanUpdate(deleteObj);
  }

  removePspOp(pspNum: string, opKey: string) {
    const updateObj = {};
    updateObj[`crm/op/${opKey}/psps/${pspNum}`] = null;
    updateObj[`crm/checkPsp/${pspNum}`] = null;
    console.log(updateObj);
    this.apiData.fanUpdate(updateObj);
  }

  printPsp(psp) {
    psp['timestamp'] = this.apiData.timestamp();
    return this.apiData.push(`crm/printPsp`, psp);
  }

  sendPsp(psp) {
    return this.apiData.get(`email/${psp}`);
  }

  postPsp(psp) {
    return this.apiData.post('email', psp);
  }

}
