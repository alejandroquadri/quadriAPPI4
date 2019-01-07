import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ProductionService, WordFilterPipe, SortPipe } from '../../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-man-logs',
  templateUrl: './man-logs.component.html',
  styleUrls: ['./man-logs.component.scss']
})
export class ManLogsComponent implements OnInit {

  prodLogs: any;
  prodSubs: any;

  production: any;
  searchInput = '';
  field = 'date';
  asc = false;
  offset = 50;

  constructor(
    public platform: Platform,
    private router: Router,
    private prodData: ProductionService,
    private filterPipe: WordFilterPipe,
    private sortPipe: SortPipe
  ) { }

  ngOnInit() {
    this.prodSubs = this.prodData.getProductionMeta().subscribe( prod => {
      this.production = prod;
      this.filter();
    });
  }

  filter() {
    const filtered = this.filterPipe.transform(this.production, this.searchInput, true);
    const ordered = this.sortPipe.transform(filtered, this.field, this.asc, true);
    this.prodLogs = this.sliceArray(ordered);
  }

  onChange(event) {
    this.searchInput = event;
    this.offset = 100;
    this.filter();
  }

  sliceArray(array: Array<any>) {
    return array.slice(0, this.offset);
  }

  doInfinite(event) {
    setTimeout( () => {
      event.target.complete();
      this.offset += 20;
      this.filter();
    }, 500);
  }

  deleteLog(log) {
    console.log(log, log.key);
    const logVal = log.payload.val();
    this.prodData.deleteProduction(log.key)
    .then ( () => {
      if (logVal.stops) {
        const stopKeys = Object.keys(logVal.stops);
        this.prodData.removeProdStop(stopKeys);
      }
    });
  }

  editLog(log, key) {
    log['$key'] = key;
    this.router.navigate([`home/produccion/carga-produccion/${key}`]);
  }

  newLog() {
    this.router.navigate([`home/produccion/carga-produccion`]);
  }

  pushPrint() {
    this.router.navigate([`home/produccion/cartel`]);
  }

}
