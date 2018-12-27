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
