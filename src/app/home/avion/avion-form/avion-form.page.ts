import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform, NavParams } from '@ionic/angular';

import * as moment from 'moment';

import { StaticDataService, FinanceService, CustomCurrencyPipe } from '../../../shared';

@Component({
  selector: 'app-avion-form',
  templateUrl: './avion-form.page.html',
  styleUrls: ['./avion-form.page.scss'],
})
export class AvionFormPage implements OnInit {

  avionForm: FormGroup;
  submitType = 'new';
  updateForm: any;
  today = moment();
  data: any;
  showSalesForm = false;
  typeChange$: any;
  accountChange$: any;
  amountChange$: any;

  amount: any;

  constructor(
    private fb: FormBuilder,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public platform: Platform,
    private fData: FinanceService,
    private staticData: StaticDataService,
    public customCurrencyPipe: CustomCurrencyPipe
  ) {
    this.data = this.staticData.data.avion;
    this.buildForm();
    this.formChangeSubs();
  }

  ngOnInit( ) {
    if (this.navParams.data.date) {
      this.updateForm = this.navParams.data;
      this.edit();
    }
  }

  buildForm() {
    this.avionForm = this.fb.group({
      date: [this.today.format('YYYY-MM-DD'), Validators.required],
      type: ['', Validators.required],
      amount: [ '', Validators.required],
      account: ['', Validators.required],
      obs: [''],
      np: [''],
      salesRep: [''],
      client: ['']
    });
  }

  edit() {
    this.submitType = 'edit';
    if (this.updateForm.account === 'Venta') {

      this.showSalesForm = true;
      this.avionForm.patchValue({
        date: this.updateForm.date,
        type: this.updateForm.type,
        amount: this.updateForm.amount,
        account: this.updateForm.account,
        obs: this.updateForm.obs,
        np: this.updateForm.np,
        salesRep: this.updateForm.salesRep,
        client: this.updateForm.client
      });

    } else {
      this.avionForm.patchValue({
        date: this.updateForm.date,
        type: this.updateForm.type,
        amount: this.updateForm.amount,
        account: this.updateForm.account,
        obs: this.updateForm.obs,
      });
    }
  }

  formChangeSubs() {

    this.typeChange$ = this.avionForm.controls['type'].valueChanges.subscribe( val => {
      console.log('type', val);
    });

    this.accountChange$ = this.avionForm.controls['account'].valueChanges.subscribe( val => {
      console.log('account', val);
      if (val === 'Venta') {
        this.showSalesForm = true;
      } else {
        this.showSalesForm = false;
      }
    });

    // this.amountChange$ = this.avionForm.controls['amount'].valueChanges.subscribe( val => {
    //   const parsed = this.customCurrencyPipe.parse(val, 0);
    //   this.amount = this.customCurrencyPipe.transform(parsed, 0);
    // });

  }

  onAmountChange(event: string) {
    const parsed = this.customCurrencyPipe.parse(event, 0);
    // this.amount = this.customCurrencyPipe.transform(parsed, 0);
    return this.customCurrencyPipe.transform(parsed, 0);
  }

  toNew() {
    this.submitType = 'new';
    this.avionForm.reset();
    this.avionForm.patchValue({
      date: this.today.format('YYYY-MM-DD')
    });
  }

  // Logica para guardar, borrar y actualizar

  onSubmit() {
    if (this.submitType === 'new') {
      this.pushNew();
    } else {
      this.update();
    }
  }

  pushNew() {
    const form = this.avionForm.value;
    const parsedAmount = this.customCurrencyPipe.parse(this.avionForm.value.amount);
    form.amount = parsedAmount;
    this.fData.pushRecord(form)
    .then( () => {
      this.avionForm.reset();
      this.avionForm.patchValue({
        date: this.today.format('YYYY-MM-DD')
      });
    });
  }

  update() {
    const form = this.avionForm.value;
    const parsedAmount = this.customCurrencyPipe.parse(this.avionForm.value.amount);
    form.amount = parsedAmount;
    this.fData.updateRecord(form, this.updateForm.$key)
    .then( () => this.modalCtrl.dismiss());
  }

}
