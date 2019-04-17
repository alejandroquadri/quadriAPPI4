import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared';
import { ToPrintInvoicesPage } from './to-print-invoices/to-print-invoices.page';
import { PrintedInvoicesPage } from './printed-invoices/printed-invoices.page';
import { DocDetailComponent } from './doc-detail/doc-detail.component';

const routes: Routes = [
  {
    path: 'pendientes-impresion',
    component: ToPrintInvoicesPage
  },
  {
    path: 'impresas',
    component: PrintedInvoicesPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    ToPrintInvoicesPage,
    PrintedInvoicesPage,
    DocDetailComponent
  ],
  entryComponents: [
    DocDetailComponent
  ]
})
export class SalesAdm {}
