import { Component, OnInit } from '@angular/core';
import { ProcurementService } from './../shared/procurement.service';

@Component({
  selector: 'proc-filters',
  templateUrl: './proc-filters.page.html',
  styleUrls: ['./proc-filters.page.scss'],
})
export class ProcFiltersPage implements OnInit {

  options: any;

  constructor(
    private spareData: ProcurementService
    ) { }

  ngOnInit() {
    this.options = this.spareData.filters;
  }

  updateFilters() {
    console.log('filters update', this.options);
    this.spareData.filters = this.options;
    this.spareData.updateFilters();
  }

}
