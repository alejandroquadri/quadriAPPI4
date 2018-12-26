import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, ModalController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import * as moment from 'moment';

import { CrmService } from '../../shared/crm.service';
import { StaticDataService, SortPipe, WordFilterPipe } from '../../../../shared';
import { AddOpPage } from '../../shared/add-op/add-op.page';
import { OpFiltersPage } from '../op-filters/op-filters.page';

@Component({
  selector: 'app-op-log',
  templateUrl: './op-log.page.html',
  styleUrls: ['./op-log.page.scss'],
})
export class OpLogPage implements OnInit {

  filters$: any;
  op$: any;
  subs$: any;
  months: any;
  statusOptions: any;

  opListCrude: Array<any>;
  filters: any;
  searchInput = '';
  sortTerm = 'total';
  sortDir = false;

  ascTotal = false;
  ascMonth = true;
  total = 0;

  opList: Array<any>;

  constructor(
    private crmData: CrmService,
    private staticData: StaticDataService,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    private filterPipe: WordFilterPipe,
    private sortPipe: SortPipe,
    private router: Router
    ) { }

  ngOnInit() {
    this.months = this.crmData.buildCloseMonth();
    this.statusOptions = this.staticData.data.crm.statusOptions;
    this.op$ = this.crmData.getOpsList();
    this.filters$ = this.crmData.filterObs;

    this.subs$ = combineLatest(this.op$, this.filters$, (ops: any, filters: any) => ({ops, filters}));
    this.subs$.subscribe( (pair: any) => {
      // console.log(pair);
      this.opListCrude = pair.ops;
      this.filters = pair.filters;
      // tslint:disable-next-line:no-unused-expression
      !this.filters ? this.filters = this.staticData.data.crm.filters : '';
      this.filter();
    });
  }

  filter() {
    const fieldsFiltered = this.fieldFilter(this.opListCrude);
    this.opList = this.filterPipe.transform(fieldsFiltered, this.searchInput, true);
    this.sort();
    this.calcTotal(this.opList);
  }

  fieldFilter(array: Array<any>) {
    return array.filter( itemMeta => {
      const item = itemMeta.payload.val();
      return (this.statusFilter(item) && this.salesRepFilter(item) && this.monthFilter(item));
    });
  }

  calcTotal(array: Array<any>) {
    this.total = 0;
    array.forEach( itemM => {
      const total = +itemM.payload.val().total;
      this.total += total;
    });
  }

  sort() {
    this.opList =  this.sortPipe.transform(this.opList, this.sortTerm, this.sortDir, true);
  }

  changeSort(term) {
    this.sortTerm = term;
    this.sortDir = !this.sortDir;
    this.sort();
  }

  searchBar(event) {
    this.searchInput = event;
    this.filter();
  }

  statusFilter(item) {
    const fields = this.changeFilters(this.filters.status);
    for (let j = 0 , n = fields.length; j < n; j++) {
      if (item.status.toLowerCase() === fields[j].toLowerCase()) {
        return true;
      }
    }
  }

  salesRepFilter(item) {
    const fields = this.changeFilters(this.filters.salesRep);
    for (let j = 0, n = fields.length; j < n; j++) {
      if (item.salesRep.toLowerCase() === fields[j].toLowerCase()) {
        return true;
      }
    }
  }

  monthFilter(item) {
    const month = this.filters.month;
    if (month === '') {
      return true;
    } else {
      if (item.closeMonth === month) {
        return true;
      }
    }
  }

  changeFilters(filters: any) {
    const keyArr: any[] = Object.keys(filters);
    const arrayFilter = [];
    keyArr.forEach(item => {
      if (filters[item]) {
        if (item === 'month') {
          arrayFilter.push(filters[item]);
        } else if (item === 'roldan') {
          arrayFilter.push('Alejandra Roldan');
        } else if (item === 'tarruella') {
          arrayFilter.push('Tarruella Alberto Horacio ');
        } else {
          arrayFilter.push(item);
        }
      }
    });
    return arrayFilter;
  }

  changeStatus(status: string, key: string) {
    this.crmData.updateOp(key, {status: status})
    .then( () => console.log('status actualizado'));
  }

  changeCloseMonth(closeMonth: string, key: string) {
    const month = moment(closeMonth, 'MMM YY').format('YYYY-MM');
    this.crmData.updateOp(key, {closeMonth: month})
    .then( () => console.log('closeMonth actualizado'));
  }

  seeOp(op: any, key: string) {
    op['$key'] = key;
    // this.navCtrl.push('CrmOpDetailPage', op);
    this.router.navigate([`home/crm/oportunidades/${key}`]);
  }

  async presentFilters(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: OpFiltersPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  // presentModal() {
  //   let profileModal = this.modalCtrl.create('CrmOpFormPage', {state:'addNew'});
  //   profileModal.present();
  // }

  async presentModal() {
    const profileModal = await this.modalCtrl.create({
      component: AddOpPage,
      componentProps: {state: 'addNew'}
    });
    return await profileModal.present();
  }

  oldMonth(month: string) {
    return moment().isAfter(month, 'month');
  }

}
