import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { CrmService } from '../../shared/crm.service';
import { StaticDataService } from '../../../../shared';

@Component({
  selector: 'app-op-filters',
  templateUrl: './op-filters.page.html',
  styleUrls: ['./op-filters.page.scss'],
})
export class OpFiltersPage implements OnInit {

  filters: any;
  months: any;

  constructor(
    public navParams: NavParams,
    private crmData: CrmService,
    private staticData: StaticDataService
  ) {
    this.filters = this.staticData.data.crm.filters;
    this.months = this.crmData.buildCloseMonth();
  }

  ngOnInit() {
    this.currentSales();
  }

  updateFilters() {
    this.crmData.filters = this.filters;
    this.crmData.updateFilters();
  }

  currentSales() {
    const current =  this.crmData.currentSalesRepCheck();
    switch (current) {
      case 'Tarruella Alberto Horacio ':
        this.filters.salesRep.roldan = false;
        break;

      case 'Alejandra Roldan':
      this.filters.salesRep.tarruella = false;
        break;
    }
  }

}
