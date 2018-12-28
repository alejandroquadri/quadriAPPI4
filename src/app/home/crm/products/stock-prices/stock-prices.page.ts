import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { WordFilterPipe, SortPipe, SalesService } from '../../../../shared';
import { CrmService } from '../../shared';

@Component({
  selector: 'app-stock-prices',
  templateUrl: './stock-prices.page.html',
  styleUrls: ['./stock-prices.page.scss'],
})
export class StockPricesPage implements OnInit {

  prices$: any;
  stock$: any;
  combine$: any;

  pricesList: any;
  stockList: any;
  priceView: any;

  searchInput = '';
  sortTerm = 'codigo';
  sortDir = true;

  constructor(
    private crmData: CrmService,
    private salesData: SalesService,
    private filterPipe: WordFilterPipe,
    private sortPipe: SortPipe,
  ) { }

  ngOnInit() {
    this.prices$ = this.crmData.getPrices()
    .pipe(
      map( res => res.json())
    )
    this.stock$ = this.salesData.getStock()
    .pipe(
      map( res => res.json())
    );
    this.combine$ = combineLatest( this.prices$, this.stock$, (prices: any, stock: any) => ({prices, stock}))
    .subscribe( pair => {
      this.pricesList = pair.prices.data;
      this.stockList = pair.stock.data;
      this.filter();
    });
  }

  searchBar(event) {
    this.searchInput = event;
    this.filter();
  }

  filter() {
    this.priceView = this.filterPipe.transform(this.pricesList, this.searchInput, false);
    this.sort();
  }

  sort() {
    this.priceView =  this.sortPipe.transform(this.priceView, this.sortTerm, this.sortDir, false);
  }

  toNumber(val: string) {
    return Number(val);
  }

}
