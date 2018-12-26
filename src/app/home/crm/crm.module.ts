import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrmSharedCModule } from './shared/crm-shared.module';

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
    CrmSharedCModule
  ],
  declarations: [
  ],
  exports: [
    CrmSharedCModule
  ]
})
export class CrmModule { }
