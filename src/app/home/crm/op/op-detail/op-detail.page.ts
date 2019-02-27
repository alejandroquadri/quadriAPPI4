import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { combineLatest } from 'rxjs';

import { StaticDataService, CustomCurrencyPipe } from '../../../../shared';
import { CrmService, ClientFormComponent, EmailPspComponent, ClientSelectPage } from '../../shared';

@Component({
  selector: 'app-op-detail',
  templateUrl: './op-detail.page.html',
  styleUrls: ['./op-detail.page.scss'],
})
export class OpDetailPage implements OnInit {

  @ViewChild('status') status;
  statusBis: any;
  opKey: any;
  op: any;

  op$: any;
  calipso$: any;
  agenda$: any;
  combine$: any;

  calipsoObj: any;
  agendaObj: any;

  presupuestos: any;
  statusOptions: any;
  months: any;
  actions: any;
  salesReps: any;
  agendaForm: FormGroup;
  edit = false;
  editAgendaKey: string;
  totalValue: any;
  opName: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public crmData: CrmService,
    private staticData: StaticDataService,
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    private customCurrencyPipe: CustomCurrencyPipe
  ) {
    this.months = this.crmData.buildCloseMonth();
    this.statusOptions = this.staticData.data.crm.statusOptions;
    this.actions = this.staticData.data.crm.actions;
    this.salesReps = this.staticData.data.crm.salesReps;
    this.buildForm();
  }

  ngOnInit() {
    this.opKey = this.route.snapshot.paramMap.getAll('id')[0];
    this.op$ = this.crmData.getOp(this.opKey);
    this.calipso$ = this.crmData.calipsoObj;
    this.agenda$ = this.crmData.getAgendaObj();

    this.combine$ = combineLatest( this.op$, this.calipso$, this.agenda$,
      ( op: any, calipsoObj: any, agendaObj) => ({op, calipsoObj, agendaObj}))
    .subscribe( (pair: any) => {
      this.op = pair.op;
      if (this.op) {
  
        this.statusBis = this.op.status;
        this.op['$key'] = this.opKey;
        this.totalValue = this.customCurrencyPipe.transform(this.op.total.toString(), 0);
        this.opName = this.op.obra;
      }
      this.calipsoObj = pair.calipsoObj.psp;
      this.agendaObj = pair.agendaObj;
    });
  }

  buildForm() {
    this.agendaForm = this.fb.group( {
      time: ['', Validators.required],
      action: ['', Validators.required],
      desc: ['', Validators.required]
    });
  }

  change(field: string, value: any) {
    // tslint:disable-next-line:no-unused-expression
    value === 'Tarruella Alberto Horacio' ? value = 'Tarruella Alberto Horacio ' : '';
    // tslint:disable-next-line:no-unused-expression
    field === 'total' ? value = Number( this.customCurrencyPipe.parse(value, 0) ) : '' ;
    const form = {};
    form[field] = value;
    this.crmData.updateOp(this.op.$key, form)
    .then( () => console.log(`${field} actualizado`));
  }

  changeCheck(agendaKey, check) {
    this.crmData.updateAgendaItem(agendaKey, { complete: check})
    .then( () => console.log('check actualizado'));
  }

  submit() {
    if (!this.edit) {
      this.newAgendaItem();
    } else {
      this.editAgendaItem();
    }
  }

  newAgendaItem() {
    const form = this.agendaForm.value;
    form['opKey'] = this.op.$key;
    form['op'] = this.op.obra;
    form['clientKey'] = this.op.clientKey;
    form['client'] = this.op.client;
    form['complete'] = false;
    form['salesRep'] = this.op.salesRep;

    this.crmData.newAgendaNote(form)
    .then( ret =>  {
      this.agendaForm.reset();
    });
  }

  switchEditAgendaItem(agendaItem, key) {
    this.editAgendaKey = key;
    this.agendaForm.patchValue( {
      time: agendaItem.time,
      action: agendaItem.action,
      desc: agendaItem.desc
    });
    this.edit = true;
  }

  switchToNew() {
    this.edit = false;
    this.editAgendaKey = undefined;
    this.agendaForm.reset();
  }

  editAgendaItem() {
    const updateForm = {
      time: this.agendaForm.value.time,
      desc: this.agendaForm.value.desc,
      action: this.agendaForm.value.action
    };
    this.crmData.updateAgendaItem(this.editAgendaKey, updateForm)
    .then( () => console.log('updated'));
  }

  deleteAgendaItem(agendaKey) {
    this.crmData.delteAgendaItem(agendaKey, this.op.$key);
  }

  async seeClient (key: string) {
    const profileModal = await this.modalCtrl.create({
      component: ClientFormComponent,
      componentProps: {$key: key, mode: 'edit'}
    });
    return await profileModal.present();
  }

  async changeClient(op) {
    const profileModal = await this.modalCtrl.create({
      component: ClientSelectPage,
      componentProps: {pablo: 'pelotudo'}
    });
    profileModal.present();
    await profileModal.onDidDismiss()
    .then (retData => {
      if (retData.data) {
        const data = retData.data;
        if (data.payload) {
          const client = data.payload.val();
          this.crmData.changeClient(client.name, op.clientKey, op.$key, data.key);
        } else {
          this.crmData.changeClient(data, op.clientKey, op.$key);
        }
      }
    });
  }

  deletePsp(psp) {
    this.crmData.removePspOp(psp, this.opKey);
  }

  onAmountChange(event) {
    const parsed = this.customCurrencyPipe.parse(event, 0);
    this.totalValue = this.customCurrencyPipe.transform(parsed, 0);
  }

  async sendPsp(psp: any) {
    const opForm = this.agendaForm.value;
    opForm['opKey'] = this.op.$key;
    opForm['op'] = this.op.obra;
    opForm['clientKey'] = this.op.clientKey;
    opForm['client'] = this.op.client;
    opForm['complete'] = false;
    opForm['salesRep'] = this.op.salesRep;


    const pspForm = this.calipsoObj[psp];
    const profileModal = await this.modalCtrl.create({
      component: EmailPspComponent,
      componentProps: {'psp': pspForm, 'op': opForm}
    });
    profileModal.present();
    profileModal.onDidDismiss()
    .then( data => {
      // tslint:disable-next-line:no-unused-expression
      data === 'dismiss' ? this.modalCtrl.dismiss() : '' ;
    });
  }

}
