import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, IonInfiniteScroll } from '@ionic/angular';

import { combineLatest } from 'rxjs';

import { CrmService } from '../../shared/crm.service';
import { WordFilterPipe, SortPipe } from '../../../../shared';
import { PspDetailPage } from '../psp-detail/psp-detail.page';
import { AddOpPage } from '../../shared/add-op/add-op.page';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-psp-log',
  templateUrl: './psp-log.page.html',
  styleUrls: ['./psp-log.page.scss'],
})
export class PspLogPage implements OnInit {

  psp$: any;
  checkedPsp$: any;
  combined$: any;

  checkedPspsObj: any;
  pspObj: any;

  pspTypes = ['Todos', 'Pendientes', 'Ignorados'];

  filteredPsp: any;
  salesRep = '';
  pspType = 'Pendientes';
  searchInput = '';
  filteredArray: any;
  viewArray: any;
  sortTerm = 'total';
  sortDir = false;
  offset = 100;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    public navCtrl: NavController,
    public crmData: CrmService,
    private searchFilter: WordFilterPipe,
    private sortPipe: SortPipe,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.psp$ = this.crmData.calipsoObj;
    this.checkedPsp$ = this.crmData.getCheckedPsp();
    this.checkCurrentSalesRep();
    this.combined$ = combineLatest(this.psp$, this.checkedPsp$, (psps: any, checkedPsp: any) => ({psps, checkedPsp}))
    .subscribe( pair => {
      pair.checkedPsp ? this.checkedPspsObj = pair.checkedPsp : this.checkedPspsObj = {};
      this.pspObj = pair.psps.psp;
      this.filterPsp();
    });
  }

  checkCurrentSalesRep() {
    this.salesRep = this.crmData.currentSalesRepCheck();
  }

  filterPsp() {
    // tslint:disable-next-line:no-unused-expression
    !this.pspObj ? this.pspObj = {} : '' ;
    const filteredArray = [];
    const psps = Object.keys(this.pspObj);
    psps.filter( ( psp: any) => {
      const value = this.pspObj[psp];
      return (
        this.filterTypePsp(psp) &&
        this.filterSalesRep(value)
      );
    })
    .forEach( psp => {
      filteredArray.push(this.pspObj[psp]);
    });
    this.filteredPsp = filteredArray;
    this.filter();
  }

  filter(event?) {
    // this.viewArray = this.searchFilter.transform(this.filteredPsp,this.searchInput, false);
    this.filteredArray = this.searchFilter.transform(this.filteredPsp, this.searchInput, false);
    this.sort();
  }

  sort() {
    this.viewArray = this.sliceArray(this.sortPipe.transform(this.filteredArray, this.sortTerm, this.sortDir, false));
  }

  filterTypePsp(psp) {
    let ret;
    switch (this.pspType) {
      case 'Todos':
        ret = true;
        break;

      case 'Pendientes':
        !this.checkedPspsObj[psp] ? ret = true : ret = false ;
        break;

      case 'Ignorados':
        this.checkedPspsObj[psp] === 'ignored' ? ret = true : ret = false;
        break;
    }
    return ret;
  }

  filterSalesRep(psp) {
    if (this.salesRep === '') {
      return true;
    } else {
      return psp.salesRep === this.salesRep;
    }
  }

  changeSort(term) {
    this.sortTerm = term;
    this.sortDir = !this.sortDir;
    this.sort();
  }

  sliceArray(array: Array<any>) {
    return array.slice(0, this.offset);
  }

  // doInfinite(infiniteScroll: InfiniteScroll) {
  //   setTimeout( () => {
  //     this.offset += 20;
  //     this.filter();
  //     infiniteScroll.complete();
  //   }, 500)
  // }

  doInfinite(event) {
    setTimeout( () => {
      event.target.complete();

      // aca es donde hay que poner la logica para que cargue mas datos
      this.offset += 20;
      this.filter();

      // esto es para que si ya tiene todos los registros no siga buscando
      // if (this.machineLogs.length === this.filteredMachineLogs.length ) {
      //   console.log('llego');
      //   event.target.disabled = true;
      // }

    }, 500);
  }

  // seePsp(psp) {
  //   let profileModal = this.modalCtrl.create('CrmPspDetailPage', psp);
  //   profileModal.present();
  // }

  async seePsp(form?: any) {
    const profileModal = await this.modalCtrl.create({
      component: PspDetailPage,
      componentProps: form
    });
    return await profileModal.present();
  }

  // addOp(psp) {
  //   let profileModal = this.modalCtrl.create('CrmOpFormPage', psp);
  //   profileModal.present();
  // }

  async addOp(form?: any) {
    const profileModal = await this.modalCtrl.create({
      component: AddOpPage,
      componentProps: form
    });
    return await profileModal.present();
  }

  ignore(psp) {
    this.crmData.ignorePsp(psp);
  }

  isoDate(date: string) {
    return `${date.substring(0, 4)}${date.substring(5, 7)}${date.substring(8, 10)}`;
  }

}
