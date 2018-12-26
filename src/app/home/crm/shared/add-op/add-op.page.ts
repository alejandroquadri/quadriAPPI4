import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, NavController, ModalController } from '@ionic/angular';

import { CrmService } from '../crm.service';
import { StaticDataService, CustomCurrencyPipe } from '../../../../shared';
import { ClientSelectPage } from './../client-select/client-select.page';
import { OpSelectPage } from '../op-select/op-select.page';

@Component({
  selector: 'app-add-op',
  templateUrl: './add-op.page.html',
  styleUrls: ['./add-op.page.scss'],
})
export class AddOpPage implements OnInit {

  salesReps: any;
  addPsp: boolean;
  addNew: boolean;
  edit: boolean;

  opForm: FormGroup;
  opKey: string;

  updateOpForm: any;
  // submitType: string;

  clientObs: any;
  clientObj: any;
  clientKey: string;
  updateClientForm: any;

  months: any;
  pspData: any;
  amount: any;

  constructor(
    public navParams: NavParams,
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    private crmData: CrmService,
    private staticData: StaticDataService,
    private customCurrencyPipe: CustomCurrencyPipe
  ) {
    if (this.navParams.data.state === 'addNew') {
      this.addNew = true;
      this.edit = false;
      this.addPsp = false;
    } else if (this.navParams.data.state === 'edit') {
      this.addNew = false;
      this.edit = true;
      this.addPsp = false;
    } else {
      this.pspData = this.navParams.data;
      this.addNew = false;
      this.edit = false;
      this.addPsp = true;
    }
    this.buildForm(this.pspData);
    this.months = this.crmData.buildCloseMonth();
    this.salesReps = this.staticData.data.crm.salesReps;
  }

  ngOnInit() {
    this.clientObs = this.crmData.getClientsObj();
    this.clientObs.subscribe( clients => {
      this.clientObj = clients;
    });
  }

  // construye el formulario
  buildForm(form?) {
    this.opForm = this.fb.group({
      obra: ['', Validators.required ],
      client: ['', Validators.required],
      salesRep: ['', Validators.required],
      closeMonth: ['', Validators.required],
      total: ['', Validators.required],
    });
    if (this.addPsp) {
      this.opForm.patchValue({
        salesRep: form.salesRep,
        total: this.customCurrencyPipe.transform(form.total, 0)
      });
      // this.onAmountChange(form.total.toString());
    }
  }

  // para llamar a los modals

  async lookClient(form?: any) {
    const profileModal = await this.modalCtrl.create({
      component: ClientSelectPage,
      componentProps: form
    });
    profileModal.present();
    await profileModal.onDidDismiss()
    .then( (retData: any) => {
      console.log('did dismissed look Client', retData);
      if (retData.data) {
        const data = retData.data;
        if (data.payload) {
          this.opForm.patchValue({
            client: data.payload.val().name
          });
          this.updateClientForm = data.payload.val();
          this.clientKey = data.key;
        } else {
          this.opForm.patchValue({
            client: data
          });
          this.clientKey = undefined;
        }
        if (this.opKey) {
          this.opForm.patchValue({
            obra: '',
            closeMonth: '',
          });
          this.opKey = undefined;
        }
      }
    });
  }

  async lookOp(form?: any) {
    const profileModal = await this.modalCtrl.create({
      component: OpSelectPage,
      componentProps: form
    });
    profileModal.present();
    await profileModal.onDidDismiss()
    .then( (retData: any) => {
      if (retData.data) {
        const data = retData.data;
        if (data.op) {
          this.opForm.patchValue({
            obra: data.op.obra,
            closeMonth: data.op.closeMonth,
            client: data.op.client
          });
          this.updateOpForm = data.op;
          this.clientKey = data.op.clientKey;
          this.opKey = data.key;
          this.updateClientForm = this.clientObj[this.clientKey];
        } else {
          this.opForm.patchValue({
            obra: data
          });
          this.opKey = undefined;
        }
      }
    });
  }

  // para que le ponga separadores de miles y comas al monto
  onAmountChange(event: string) {
    const parsed = this.customCurrencyPipe.parse(event, 0);
    return this.customCurrencyPipe.transform(parsed, 0);
  }

  // funciones para guardad datdos
  onSubmit() {
    this.saveNewOPPsp();
  }


  saveNewOPPsp() {
    let opForm;
    let clientForm;
    let psp = {};
    let razSoc;
    this.addPsp ? psp[this.pspData.num] = true : psp = undefined;

    if (!this.opKey) {
      console.log('viene por aca');
      opForm = this.opForm.value;
      // opForm.total = Number(this.opForm.value.total);
      opForm.total = Number(this.customCurrencyPipe.parse(this.opForm.value.total, 0));
      // tslint:disable-next-line:no-unused-expression
      this.opForm.value.salesRep === 'Tarruella Alberto Horacio' ? opForm.salesRep = 'Tarruella Alberto Horacio ' : '';
      opForm['psps'] = {};
      opForm['status'] = 'Pendiente';
    } else {
      opForm = this.updateOpForm;
      // if (opForm.total !== Number( this.opForm.value.total)) {
      //   opForm.total = Number(this.opForm.value.total);
      // }
      if ( opForm.total !== Number(this.customCurrencyPipe.parse(this.opForm.value.total, 0)) ) {
        opForm.total = Number(this.customCurrencyPipe.parse(this.opForm.value.total, 0));
      }
    }
    // tslint:disable-next-line:no-unused-expression
    !opForm['psps'] ? opForm['psps'] = {} : '' ;
    // tslint:disable-next-line:no-unused-expression
    this.addPsp ? opForm['psps'][this.pspData.num] = true : '';

    if (!this.clientKey) {
      clientForm = {
        name: this.opForm.value.client,
        ops: {},
        contacts: {}
      };
      if (this.addPsp) {
        clientForm['razSoc'] = [];
        clientForm['razSoc'].push(this.pspData.razSoc);
        razSoc = this.pspData.razSoc;
      }
    } else {
      clientForm = this.updateClientForm;
      if ( this.addPsp ) {
        console.log(clientForm);
        // tslint:disable-next-line:no-unused-expression
        !clientForm['razSoc'] ? clientForm['razSoc'] = [] : '' ;
        if (clientForm['razSoc'].indexOf(this.pspData.razSoc) === (-1)) {
          clientForm['razSoc'].push(this.pspData.razSoc);
          razSoc = this.pspData.razSoc;
        }
      }
    }
    this.crmData.saveNewOp(opForm, clientForm, psp, razSoc, this.opKey, this.clientKey)
    .then( (ret) => {
      console.log(ret);
      this.modalCtrl.dismiss(ret);
    });
  }

}
