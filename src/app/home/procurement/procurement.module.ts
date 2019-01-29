import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared';
import { ProcLogPage } from './proc-log/proc-log.page';
import { ProcFormPage } from './proc-form/proc-form.page';
import { ProcFiltersPage } from './proc-filters/proc-filters.page';


const routes: Routes = [
  {
    path: '',
    component: ProcLogPage
  },
  {
    path: 'carga',
    component: ProcFormPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    ProcLogPage,
    ProcFormPage,
    ProcFiltersPage
  ],
  entryComponents: [
    ProcFormPage,
    ProcFiltersPage
  ]
})
export class ProcurementModule { }
