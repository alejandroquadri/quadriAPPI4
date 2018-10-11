import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, Platform, ModalController} from '@ionic/angular';
import * as firebase from 'firebase';

import { ProcurementService } from '../shared/procurement.service';
import { LoggerService } from '../../../auth/shared/logger.service';
import { StaticDataService } from '../../../shared';

@Component({
  selector: 'proc-form',
  templateUrl: './proc-form.page.html',
  styleUrls: ['./proc-form.page.scss'],
})
export class ProcFormPage implements OnInit {

  spareForm: FormGroup;
  submitType = 'new';
  updateForm: any;
  data: any;

  constructor(
    private fb: FormBuilder,
    public navParams: NavParams,
    public platform: Platform,
    public modalCtrl: ModalController,
    private spareData: ProcurementService,
    private authData: LoggerService,
    private staticData: StaticDataService
    ) {
    }

    ngOnInit() {
    this.data = this.staticData.data.produccion;
    this.buildForm();
    if (this.navParams.data.detalle) {
      this.updateForm = this.navParams.data;
      this.edit();
    }
  }

  buildForm() {
    this.spareForm = this.fb.group({
      tipo: ['', Validators.required],
      detalle: ['', Validators.required],
      destino: ['', Validators.required],
      cantidad: ['', Validators.required],
      unidad: ['', Validators.required],
      muestra: [false],
      proveedor: [''],
      observacion: ['']
    });
  }

  edit() {
    this.submitType = 'edit';
    let muestra;
    if (this.updateForm.muestra === 'si' ) {
      muestra = true;
    } else {
      muestra = false;
    }

    this.spareForm = this.fb.group({
      tipo: this.updateForm.tipo,
      detalle: this.updateForm.detalle,
      destino: this.updateForm.destino,
      cantidad: this.updateForm.cantidad,
      unidad: this.updateForm.unidad,
      muestra: muestra,
      proveedor: this.updateForm.proveedor || '',
      observacion: this.updateForm.observacion || ''
    });

  }

  onSubmit() {
    if (this.submitType === 'new') {
      this.pushNew();
    } else {
      this.update();
    }
  }

  update() {
    const form = this.spareForm.value;
    if (this.spareForm.value.muestra === true ) {
      form.muestra = 'si';
    } else {
      form.muestra = 'no';
    }
    this.spareData.updateSparePart(this.updateForm.$key, form);
    this.modalCtrl.dismiss();
  }

  pushNew() {
    const form = this.spareForm.value;
    form['fecha'] = firebase.database.ServerValue.TIMESTAMP;
    form['status'] = 'Autorizacion';
    form['user'] = {
      displayName: this.authData.current.displayName,
      uid: this.authData.current.uid
    };
    if (this.spareForm.value.muestra === true ) {
      form.muestra = 'si';
    } else {
      form.muestra = 'no';
    }
    this.spareData.pushSparePart(form)
    .then( ret => {
      this.spareForm.reset();
    });
  }

  toNew() {
    this.submitType = 'new';
    this.spareForm.reset();
  }

}

