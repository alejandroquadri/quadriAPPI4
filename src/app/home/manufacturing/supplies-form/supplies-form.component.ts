import { Component, OnInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';

import { StaticDataService, ProductionService } from '../../../shared';
import * as moment from 'moment';

@Component({
  selector: 'app-supplies-form',
  templateUrl: './supplies-form.component.html',
  styleUrls: ['./supplies-form.component.scss']
})
export class SuppliesFormComponent implements OnInit {

  sForm: any;
  today = moment();
  staticData: any;

  constructor(
    public platform: Platform,
    public fb: FormBuilder,
    public staticDataP: StaticDataService,
    public renderer: Renderer,
    private prodData: ProductionService
  ) {
    this.buildForm();
    this.staticData = this.staticDataP.data.produccion;
   }

  ngOnInit() {
  }

  buildForm() {
    this.sForm = this.fb.group({
      date: ['', Validators.required],
      machine: ['', Validators.required],
      cab: [''],
      brick: [''],
      obs: ['']
    });
    this.setFormToday();
  }

  setFormToday() {
    this.sForm.patchValue({
      date: this.today.format('YYYY-MM-DD')
    });
  }

  onSubmit() {
    const form = this.sForm.value;
    const keys = Object.keys(form);
    keys.forEach(key => {
      if (form[key] === '') {
        delete form[key];
      }
    });
    this.prodData.pushSupply(form);
    this.clearPartial(this.sForm.value.machine);
  }

  clear() {
    this.sForm.reset();
    this.setFormToday();
  }

  clearPartial(machine: string) {
    switch (machine) {
      case 'Breton':
        this.sForm.controls.cab.reset();
        this.sForm.controls.brick.reset();
        this.sForm.controls.obs.reset();
      break;

      case 'Lineal':
        this.sForm.controls.cab.reset();
        this.sForm.controls.brick.reset();
        this.sForm.controls.obs.reset();
      break;

      default:
        this.clear();
        break;
    }
  }

}
