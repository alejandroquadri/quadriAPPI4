import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StockPricesPage } from './stock-prices.page';
import { SharedModule } from '../../../../shared';

const routes: Routes = [
  {
    path: '',
    component: StockPricesPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StockPricesPage]
})
export class StockPricesPageModule {}
