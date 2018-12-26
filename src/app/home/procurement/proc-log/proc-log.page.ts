import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, PopoverController, ModalController, IonInfiniteScroll } from '@ionic/angular';

import { combineLatest } from 'rxjs';

import { StaticDataService, FieldFilterPipe, SortPipe, WordFilterPipe } from '../../../shared';
import { ProcFormPage } from './../proc-form/proc-form.page';
import { ProcurementService } from '../shared/procurement.service';
import { ProcFiltersPage } from '../proc-filters/proc-filters.page';

@Component({
  selector: 'proc-log',
  templateUrl: './proc-log.page.html',
  styleUrls: ['./proc-log.page.scss'],
})
export class ProcLogPage implements OnInit {

  statusOptions: any;
  spare$: any;
  filter$: any;
  combined$: any;

  sparePartsCrude: any;
  filters: any;
  spareParts: any;

  searchInput = '';
  field = 'fecha';
  asc = false;
  offset = 50;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private staticData: StaticDataService,
    private spareData: ProcurementService,
    private fieldFilterPipe: FieldFilterPipe,
    private filterPipe: WordFilterPipe,
    private sortPipe: SortPipe,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public platform: Platform
  ) {
    this.statusOptions = this.staticData.data.produccion.tipoStatus;
  }

  ngOnInit() {
    this.spare$ = this.spareData.getSparePartsMeta();
    this.filter$ = this.spareData.filterObs;

    this.combined$ = combineLatest(this.spare$, this.filter$);
    this.combined$.subscribe(
      ([parts, filters]) => {
        this.sparePartsCrude = parts;
        this.filters = filters;
        this.offsetInit();
        this.filter();
      }
    );
  }

  filter() {
    const filteredField = this.fieldFilterPipe.transform(this.sparePartsCrude, ['status'], this.changeFilters(this.filters), true);
    const filtered = this.filterPipe.transform(filteredField, this.searchInput, true);
    const ordered = this.sortPipe.transform(filtered, this.field, this.asc, true);
    this.spareParts = this.sliceArray(ordered);
  }

  changeFilters(filters: any) {
    const keyArr: any[] = Object.keys(filters);
    const arrayFilter = [];
    keyArr.forEach(item => {
      if (filters[item]) {
        arrayFilter.push(item);
      }
    });
    return arrayFilter;
  }

  sliceArray(array: Array<any>) {
    return array.slice(0, this.offset);
  }

  offsetInit() {
    this.offset = 50;
  }

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

  deletepart(key) {
    this.spareData.deleteSparePart(key);
  }

  editPart(part: any, key) {
    part['$key'] = key;
    this.presentModal(part);
  }

  async presentModal(form?: any) {
    const profileModal = await this.modalCtrl.create({
      component: ProcFormPage,
      componentProps: form
    });
    return await profileModal.present();
  }

  async presentOptions(event) {
    const popover = await this.popoverCtrl.create({
      component: ProcFiltersPage,
      event: event
    });
    return await popover.present();
  }

  changeStatus(status: string, key: string) {
    this.spareData.updateSparePart(key, {status: status});
  }

  onChange(event) {
    this.offsetInit();
    this.searchInput = event;
    this.filter();
  }

}
