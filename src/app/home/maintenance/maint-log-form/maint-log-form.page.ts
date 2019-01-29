import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';

import { MaintenanceService } from './../shared/maintenance.service';
import { LoggerService } from '../../../auth/shared/logger.service';
import { StaticDataService } from '../../../shared';
import * as firebase from 'firebase/app';
import * as moment from 'moment';

@Component({
  selector: 'maint-log-form',
  templateUrl: './maint-log-form.page.html',
  styleUrls: ['./maint-log-form.page.scss'],
})
export class MaintLogFormPage implements OnInit {

  machineForm: FormGroup;
  submitType = 'new';
  updateForm: any;
  machines: any;
  today = moment().format('YYYY-MM-DD');
  @Input() form: any;

  constructor(
    private fb: FormBuilder,
    public platform: Platform,
    public modalCtrl: ModalController,
    private machineLogData: MaintenanceService,
    private authData: LoggerService,
    private staticData: StaticDataService
  ) {
    this.machines = this.staticData.data.produccion.maquinas;
    this.buildForm();
  }

  ngOnInit() {
    if (this.form) {
      this.updateForm = this.form;
      this.edit();
    }
  }

  buildForm() {
    this.machineForm = this.fb.group({
      date: [this.today , Validators.required ],
      title: ['', Validators.required],
      orderNumber: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  edit() {
    console.log(this.updateForm);
    this.submitType = 'edit';

    this.machineForm.patchValue({
      date: this.updateForm.date,
      title: this.updateForm.title,
      orderNumber: this.updateForm.orderNumber,
      description: this.updateForm.description,
    });
  }

  onSubmit() {
    if (this.submitType === 'new') {
      this.pushNew();
    } else {
      this.update();
    }
  }

  toNew() {
    this.submitType = 'new';
    this.machineForm.reset();
    this.machineForm.patchValue({
      date: this.today,
    });
  }

  pushNew() {
    const form = this.machineForm.value;
    form['timestamp'] = firebase.database.ServerValue.TIMESTAMP;
    form['user'] = {
      displayName: this.authData.current.displayName,
      uid: this.authData.current.uid
    };
    this.machineLogData.pushMachineLog(form)
    .then( ret => {
      this.machineForm.reset();
    });
  }

    update() {
    const form = this.machineForm.value;
    this.machineLogData.updateLog(this.updateForm.$key, form)
    .then( ret => {
      this.modalCtrl.dismiss();
    });
  }

}
