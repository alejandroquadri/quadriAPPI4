import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CrmService } from '../crm.service';
import { LoggerService } from '../../../../auth/shared/logger.service';
import * as moment from 'moment';

import { map } from 'rxjs/operators';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-email-psp',
  templateUrl: './email-psp.component.html',
  styleUrls: ['./email-psp.component.scss']
})
export class EmailPspComponent implements OnInit {

  emailForm: FormGroup;
  psp: any;
  op: any;
  currentEmail: string;
  currentSalesMan: string;

  constructor(
    // public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private crmData: CrmService,
    private authData: LoggerService
  ) {
    this.buildForm();
    this.currentEmail = this.authData.current.email;
    this.currentSalesMan = this.crmData.currentSalesRep;
   }

  ngOnInit() {
    this.psp = this.navParams.data.psp;
    this.op = this.navParams.data.op;
  }

  buildForm() {
    this.emailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      cc: [''],
      obs: ['']
    });
  }

  onSubmit() {
    const today = moment().format('YYYY-MM-DD');

    const emailForm = this.emailForm.value;
    emailForm['date'] = this.psp.date;
    emailForm['number'] = this.psp.num;
    emailForm['razSoc'] = this.psp.razSoc;
    emailForm['salesRep'] = this.psp.salesRep;
    emailForm['total'] = this.psp.total;
    emailForm['items'] = this.psp.items;
    emailForm['iva'] = this.psp.ivaTotal;
    emailForm['iibb'] = this.psp.iibb;
    emailForm['final'] = this.psp.totalFinal;
    emailForm['currentEmail'] = this.currentEmail;

    let activityForm = {
      time: today,
      action: 'Envio de psp',
      desc: `Envio presupuesto ${this.psp.num} a ${emailForm.to}`,
      complete: true,
      salesRep: this.currentSalesMan
    };

    if (this.op) {
      activityForm = this.op;
      activityForm['time'] = today;
      activityForm['action'] = 'Envio de psp';
      activityForm['desc'] = `Envio presupuesto ${this.psp.num} a ${emailForm.to}`;
      activityForm['complete']  = true;
    }

    this.crmData.postPsp(emailForm)
    .pipe(
      map( res => res.json())
    )
    .toPromise()
    .then( res => {
      console.log('mail enviado');
      this.crmData.newAgendaNote(activityForm);
    })
    .then( ret =>  {
      console.log('activity log cargado', ret);
      this.modalCtrl.dismiss('dismiss');
    })
    .catch( reason => {
      console.log('error en envio' , reason);
    });
  }

}
