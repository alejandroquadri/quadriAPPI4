import { Component, OnInit, ViewChild } from '@angular/core';

import { NavController, Platform, PopoverController, ModalController, IonInfiniteScroll } from '@ionic/angular';

import { MaintenanceService } from './../shared/maintenance.service';
import { WordFilterPipe, SortPipe } from '../../../shared';
import { MaintLogFormPage } from '../maint-log-form/maint-log-form.page';

@Component({
  selector: 'maint-log',
  templateUrl: './maint-log.page.html',
  styleUrls: ['./maint-log.page.scss'],
})
export class MaintLogPage implements OnInit {

  machineSubs: any;
  machineDataCrude: any;
  filteredMachineLogs: any;
  machineLogs: any;

  searchInput = '';
  field = 'date';
  asc = false;
  offset = 50;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    private machineLogData: MaintenanceService,
    private filterPipe: WordFilterPipe,
    private sortPipe: SortPipe
  ) { }

  ngOnInit() {
    this.machineSubs = this.machineLogData.getMachineLogsMeta().subscribe(logs => {
      this.machineDataCrude = logs;
      this.filter();
    });
  }

  filter() {
    // const filtered = this.filterPipe.transform(this.machineDataCrude, this.searchInput, true);
    this.filteredMachineLogs = this.filterPipe.transform(this.machineDataCrude, this.searchInput, true);
    const ordered = this.sortPipe.transform(this.filteredMachineLogs, this.field, this.asc, true);
    this.machineLogs = this.sliceArray(ordered);
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
      if (this.machineLogs.length === this.filteredMachineLogs.length ) {
        console.log('llego');
        event.target.disabled = true;
      }

    }, 500);
  }

  deleteLog(key) {
    this.machineLogData.deleteLog(key);
  }

  editLog(log, key) {
    log['$key'] = key;
    this.presentModal(log);
  }

  async presentModal(form?: any) {
    const profileModal = await this.modalCtrl.create({
      component: MaintLogFormPage,
      componentProps: form
    });
    return await profileModal.present();
  }

  onChange(event) {
    this.searchInput = event;
    this.filter();
  }

}
