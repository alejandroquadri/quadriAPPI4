import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrmSharedModule } from './shared/crm-shared.module';

const routes: Routes = [
  {
    path: 'presupuestos',
    loadChildren: './psp/psp-crm.module#PspCrmModule'
  },
  {
    path: 'oportunidades',
    loadChildren: './op/op-crm.module#OpCrmModule'
  },
  {
    path: 'registro-actividades',
    loadChildren: './activity/activity-log/activity-log.module#ActivityLogPageModule'
  },
  { path: 'stock-precio',
    loadChildren: './products/stock-prices/stock-prices.module#StockPricesPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CrmSharedModule
  ],
  declarations: [
  ],
  exports: [
    CrmSharedModule
  ]
})
export class CrmModule { }
