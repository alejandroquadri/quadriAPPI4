import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintLogFormPage } from './maint-log-form/maint-log-form.page';
import { MaintLogPage } from './maint-log/maint-log.page';
import { SharedModule } from '../../shared';

const routes: Routes = [
  {
    path: '',
    component: MaintLogPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    MaintLogPage,
    MaintLogFormPage
  ],
  entryComponents: [
    MaintLogFormPage
  ]
})
export class MaintenanceModule { }
