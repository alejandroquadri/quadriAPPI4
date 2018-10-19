import { Component, ViewChild, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { ProdProgramService } from '../prod-program/prod-program.service';
import { WordFilterPipe } from './../../shared/pipes/word-filter.pipe';

@Component({
  selector: 'del-program',
  templateUrl: './del-program.page.html',
  styleUrls: ['./del-program.page.scss'],
})
export class DelProgramPage implements OnInit {

  npSubs: any;
  scProgSubs: any;
  subs: any;

  npList: any;
  scProgList: any;
  npObj: any;
  npObjNoFilter: any;
  scObj: any;

  periodArray = [];

  scForm: FormGroup;
  showForm = true;
  editing = false;
  editKey: string;
  searchInput = '';
  wasFiltered = false;

  showCalc = false;
  npCodeObj = {};
  totalPending = 0;
  totalProg = 0;
  load = true;

  @ViewChild('qInput') qInput;

  constructor(
    private progData: ProdProgramService,
    private fb: FormBuilder,
    private filterPipe: WordFilterPipe
  ) {
    this.buildPeriodArray();
    this.buildForm();
  }

  ngOnInit() {
    this.npSubs = this.progData.getNPPendientes()
    .pipe(
      map( (res: any) => res.json())
    );
    this.scProgSubs = this.progData.getScProgram();

    this.subs = combineLatest(this.npSubs, this.scProgSubs, (np: any, scProg: any) => ({np, scProg}));
    this.subs.subscribe( (pair: any) => {
      this.npList = pair.np.data;
      this.scProgList = pair.scProg;
      this.filter();
      this.scObj = this.buildScObj(this.scProgList);
    });
  }

  filter() {
    let filtered;
    if (this.load) {
      this.npObj = this.buildNpObj(this.npList);
      this.npObjNoFilter = this.npObj;
      this.load = false;
    } else {
      if (this.searchInput.length > 3) {
        filtered = this.filterPipe.transform(this.npList, this.searchInput, false);
        this.npObj = this.buildNpObj(filtered);
      } else {
        this.npObj = this.npObjNoFilter;
      }
    }
  }

  buildNpObj(npList: Array<any>) {
    this.load = false;
    const npObj = {};
    this.totalPending = 0;
    this.totalProg = 0;

    npList.forEach( np => {

      const item = {
        code: np.codigo,
        desc: np.descripcion,
        dim: np.dimension,
        original: np.original,
        entregado: np.entregado,
        pendiente: np.pendiente
      };
      if (!npObj[np.np]) {
        npObj[np.np] = {
          date: np.fecha,
          salesRep: np.vendedor,
          deliveryDate: np.entrega,
          client: np.cliente,
          items: []
        };
        npObj[np.np].items.push(item);
      } else {
        npObj[np.np].items.push(item);
      }

    });
    return npObj;
  }

  buildScObj(scList: Array<any>) {
    const scObj = {};

    scList.forEach( sc => {
      const values = sc.payload.val();

      if (values.np  in this.npObj) {

        const form = {
          quantity: values.quantity,
          paid: values.paid,
          delivery: values.delivery,
          takeAway: values.takeAway,
          reserved: values.reserved,
          obs: values.obs,
          $key: sc.key
        };

        if (!scObj[values.np]) {
          scObj[values.np] = {};
          scObj[values.np][values.code] = {};
          scObj[values.np][values.code][values.date] = form;
        } else {
          if (!scObj[values.np][values.code]) {
            scObj[values.np][values.code] = {};
            scObj[values.np][values.code][values.date] = form;
          } else {
            scObj[values.np][values.code][values.date] = form;
          }
        }
      }
    });
    return scObj;
  }

  buildPeriodArray(start?, weeks?: number) {
    // tslint:disable-next-line:no-unused-expression
    weeks ? '' : weeks = 2;

    if (start) {
      this.periodArray = [];
    } else {
      start = moment();
    }

    const startWeek = start.clone().startOf('isoWeek');
    // this.periodArray.push(startWeek);

    for (let i = 0; i < weeks; i++) {
      if (i !== 0) {
        startWeek.add(2, 'days');
      }
      for (let j = 0; j < 6; j++) {
        let add = 1;
        if (j === 0) { add = 0; }
        startWeek.add(add, 'days');
        const day = startWeek.clone();
        this.periodArray.push(day);
      }
    }
  }

  nextWeek() {
    const start = this.periodArray[6];
    this.buildPeriodArray(start);

  }

  prevWeek() {
    const start = moment(this.periodArray[6]).add(-14, 'days');
    this.buildPeriodArray(start);
  }

  thisWeek() {
    const start = moment();
    this.buildPeriodArray(start);
  }

  isToday(date) {
    return moment(date).format('YYYYMMDD') === moment().format('YYYYMMDD');
  }

  shortSales(salesRep: string) {
    let short;
    switch (salesRep) {
      case 'Alejandra Roldan':
        short = 'AR';
        break;

      case 'Tarruella Alberto Horacio ':
        short = 'AT';
        break;

      default:
        short = salesRep;
        break;
    }

    return short;
  }

  dateFormat(date: any, type: string) {
    if (date === 'anterior') {
      return 'anterior';
    } else if (type === 'fechaObj') {
      return moment(date).format('YYYY-MM-DD');
    } else if (type === 'dia') {
      return moment(date).format('dd');
    } else {
      return moment(date).format('DD-MM');
    }
  }

  returnQ(np: string, code: string, date: any) {
    const dateObj = this.dateFormat(date, 'fechaObj');

    if (this.scObj[np] && this.scObj[np][code] && this.scObj[np][code][dateObj]) {
      return this.scObj[np][code][dateObj];
    } else {
      return undefined;
    }
  }

  buildForm() {
    return this.scForm = this.fb.group({
      date: ['', Validators.required],
      np: ['', Validators.required],
      code: ['', Validators.required],
      quantity: ['', Validators.required],
      obs: [''],
      paid: [''],
      delivery: [''],
      takeAway: [''],
      reserved: ['']
    });
  }

  submit() {
    if (!this.editing) {
      this.newProg();
    } else {
      this.edit();
    }
  }

  newProg() {
    this.progData.pushNewScProg(this.scForm.value);
    this.scForm.reset();
  }

  edit() {
    this.progData.updateScProg(this.scForm.value, this.editKey);
  }

  remove() {
    this.progData.deleteScProg(this.editKey)
    .then( () => {
      this.editKey = undefined;
      this.editing = false;
      this.scForm.reset();
    });
  }

  addToForm(np: string, code: string, date, value?) {
    // setTimeout(() => {
      this.qInput.setFocus(); // le pongo un timeout para que haga focus cuando carga
    // },150);
    if (value) {
      this.editing = true;
      this.editKey = value.$key;
      this.scForm.patchValue({
        date: moment(date).format('YYYY-MM-DD'),
        np: np,
        code: code,
        quantity: value.quantity || '',
        obs: value.obs || '',
        paid: value.paid || false,
        delivery: value.delivery || false,
        takeAway: value.takeAway || false,
        reserved: value.reserved || false,
      });
    } else {
      this.editing = false;
      this.editKey = undefined;
      this.scForm.patchValue({
        date: moment(date).format('YYYY-MM-DD'),
        np: np,
        code: code,
        quantity: '',
        obs: '',
        paid: false,
        delivery: false,
        takeAway: false,
        reserved: false
      });
    }
  }

  reservedChange(event) {
    if (this.scForm.value.reserved && (this.scForm.value.quantity < 0)) {
      this.scForm.patchValue({
        quantity: Math.abs(this.scForm.value.quantity)
      });
    }
  }

  deliveryChange() {
    const formVal = this.scForm.value;
    if (formVal.delivery === true) {
      this.scForm.patchValue({
        takeAway: false,
        delivery: true
      });
    }
  }

  takeAwayChange() {
    const formVal = this.scForm.value;
    if (formVal.takeAway === true) {
      this.scForm.patchValue({
        delivery: false,
        takeAway: true
      });
    }
  }

}

