import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform, PopoverController, ModalController, IonInfiniteScroll } from '@ionic/angular';

import { WordFilterPipe, SortPipe, FinanceService } from '../../../shared';
import { AvionFormPage } from '../avion-form/avion-form.page';

@Component({
  selector: 'app-avion-log',
  templateUrl: './avion-log.page.html',
  styleUrls: ['./avion-log.page.scss'],
})
export class AvionLogPage implements OnInit {

  avion$: any;
  avionList: any;
  filtered: any;
  avionView: any;

  searchInput = '';
  field = 'date';
  asc = false;
  offset = 50;
  total = 0;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    private filterPipe: WordFilterPipe,
    private sortPipe: SortPipe,
    private fData: FinanceService,
  ) { }

  ngOnInit( ) {
    this.avion$ = this.fData.getAvionList().subscribe( avionList => {
      this.avionList = avionList;
      this.filter();
    });
  }

  filter() {
    this.filtered = this.filterPipe.transform(this.avionList, this.searchInput, true);
    const ordered = this.sortPipe.transform(this.filtered, this.field, this.asc, true);
    this.avionView = this.sliceArray(ordered);
    this.calcTotal();
  }

  sliceArray(array: Array<any>) {
    return array.slice(0, this.offset);
  }

  doInfinite(event) {
    setTimeout( () => {
      event.target.complete();

      // aca es donde hay que poner la logica para que cargue mas datos
      this.offset += 20;
      this.filter();

      // esto es para que si ya tiene todos los registros no siga buscando
      if (this.avionView.length === this.filtered.length ) {
        console.log('llego');
        event.target.disabled = true;
      }

    }, 500);
  }

  calcTotal() {
    this.total = 0;
    this.filtered.forEach( record => {
      const val = record.payload.val();
      let amount = Number(val.amount);
      if (val.type === 'Egreso') {
        amount = -amount;
      }
      this.total += amount;
    });
  }

  deleteLog(key: string) {
    this.fData.deleteRecord(key);
  }

  editLog(record: any, key) {
    record['$key'] = key;
    this.presentModal(record);
  }

  onChange(event) {
    this.offsetInit();
    this.searchInput = event;
    this.filter();
  }

  offsetInit() {
    this.offset = 50;
  }

  async presentModal(form?: any) {
    const profileModal = await this.modalCtrl.create({
      component: AvionFormPage,
      componentProps: form
    });
    return await profileModal.present();
  }

}
