import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { CrmService, AddOpPage, OpSelectPage } from '../../shared';
import { StaticDataService } from '../../../../shared';
import * as moment from 'moment';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.page.html',
  styleUrls: ['./activity-log.page.scss'],
})
export class ActivityLogPage implements OnInit {

  agenda$: any;
  agendaList: any;
  agendaObj: any;
  date: string = moment().format('YYYY-MM-DD');

  salesMan = '';
  currentSalesMan: any;

  agendaForm: FormGroup;
  actions: any;
  edit = false;
  editAgendaKey: string;
  editAgenda: any;
  opName: string;
  opObject: any;
  showOp = true;

  constructor(
    private crmData: CrmService,
    private router: Router,
    private staticData: StaticDataService,
    private fb: FormBuilder,
    public modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.currentSalesMan = this.crmData.currentSalesRepCheck();
    this.actions = this.staticData.data.crm.actions;
    this.agenda$ = this.crmData.getAgendaList().subscribe( agenda => {
      this.agendaList = agenda;
      // console.log(this.agendaList);
      this.buildAgendaObj();
    });
    this.buildForm();
    this.agendaForm.patchValue({
      time: moment().format('YYYY-MM-DD')
    });
  }

  buildForm() {
    this.agendaForm = this.fb.group( {
      time: ['', Validators.required],
      action: ['', Validators.required],
      desc: ['', Validators.required]
    });
  }

  buildAgendaObj() {
    const agendaObj = {};

    this.agendaList.forEach( agendaItem => {
      const item = agendaItem.payload.val();
      item['$key'] = agendaItem.key;

      if (!agendaObj[item.time]) {
        agendaObj[item.time] = [];
        agendaObj[item.time].push(item);
      } else {
        agendaObj[item.time].push(item);
      }
    });
    this.agendaObj = agendaObj;
    // console.log(this.agendaObj);
  }

  back() {
    this.date = moment(this.date).add(-1, 'days').format('YYYY-MM-DD');
    this.buildAgendaObj();
  }

  forward() {
    this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
    this.buildAgendaObj();
  }

  changeCheck(agendaKey, check) {
    // console.log(check);
    this.crmData.updateAgendaItem(agendaKey, { complete: check})
    .then( () => console.log('check actualizado'));
  }

  seeOp(key: string) {
    const op = {
      $key: key
    };
    this.router.navigate([`/home/crm/oportunidades/${key}`]);
    // this.navCtrl.push('CrmOpDetailPage', op);
  }

  submit() {
    // console.log(this.agendaForm.value);
    if (!this.edit) {
      this.newAgendaItem();
    } else {
      this.editAgendaItem();
    }
  }

  async lookOp() {
    const modal = await this.modalCtrl.create({
      component: OpSelectPage,
      componentProps: {from: 'activity'}
    });
    modal.present();

    modal.onDidDismiss()
    .then( (data: any) => {
      if (data) {
        this.opName = data.op.obra;
        this.opObject = data.op;
        this.opObject['$key'] = data.key;
      }
    });
  }

  async addOp() {
    const modal = await this.modalCtrl.create({
      component: AddOpPage,
      componentProps: {from: 'activity'}
    });
    modal.present();
    modal.onDidDismiss()
    .then( (data: any) => {
      if (data) {
        this.opName = data.obra;
        this.opObject = data;
      }
    });
  }

  newAgendaItem() {
    const form = this.agendaForm.value;

    if (this.opObject) {
      form['opKey'] = this.opObject.$key;
      form['op'] = this.opObject.obra;
      form['clientKey'] = this.opObject.clientKey;
      form['client'] = this.opObject.client;
      form['complete'] = false;
      form['salesRep'] = this.opObject.salesRep;
    } else {
      form['salesRep'] = this.currentSalesMan || '';
    }

    this.crmData.newAgendaNote(form)
    .then( ret =>  {
      this.agendaForm.reset();
      this.opName = '';
      this.opObject = undefined;
    });
  }

  editAgendaItem() {
    const updateForm = {
      time: this.agendaForm.value.time,
      desc: this.agendaForm.value.desc,
      action: this.agendaForm.value.action,
      salesRep: this.currentSalesMan
    };
    if (this.opObject) {
      updateForm['op'] = this.opObject.obra;
      updateForm['opKey'] = this.opObject.$key;
    }

    // console.log(updateForm);
    this.crmData.editAgendaItem(updateForm, this.editAgendaKey)
    .then( () => console.log('updated'));
  }

  deleteAgendaItem(agendaItem) {
    // console.log(agendaItem);
    let opKey;
    agendaItem.opKey ? opKey = agendaItem.opKey : opKey = undefined;
    this.crmData.delteAgendaItem(agendaItem.$key, opKey);
  }

  switchEditAgendaItem(agendaItem) {
    // console.log(agendaItem);
    this.editAgendaKey = agendaItem.$key;
    this.editAgenda = agendaItem;
    this.opName = '';
    this.opObject = undefined;
    this.agendaForm.patchValue( {
      time: agendaItem.time,
      action: agendaItem.action,
      desc: agendaItem.desc
    });
    this.edit = true;
    agendaItem.opKey ? this.showOp = false : this.showOp = true;
  }

  switchToNew() {
    this.edit = false;
    this.showOp = true;
    this.editAgendaKey = undefined;
    this.editAgenda = undefined;
    this.opName = '';
    this.opObject = undefined;
    this.agendaForm.reset();
  }

  minSalesRep(salesRep: string): String {
    let minSales;
    switch (salesRep) {
      case 'Tarruella Alberto Horacio ':
        minSales = 'AT';
        break;

      case 'Alejandra Roldan':
        minSales = 'AR';
        break;

      default:
        minSales = '';
        break;
    }
    return minSales;
  }

}
