import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared';
import { ProcLogPage } from './proc-log/proc-log.page';
import { ProcFormPage } from './proc-form/proc-form.page';


const routes: Routes = [
  {
    path: '',
    component: ProcLogPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    ProcLogPage,
    ProcFormPage
  ],
  entryComponents: [
    ProcFormPage
  ]
})
export class ProcurementModule { }
