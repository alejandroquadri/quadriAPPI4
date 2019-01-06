import { ClientFormComponent } from './../../shared/client-form/client-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientLogPage } from './client-log.page';
import { SharedModule } from '../../../../shared';
import { CrmSharedModule } from '../../shared';

const routes: Routes = [
  {
    path: '',
    component: ClientLogPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    CrmSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ClientLogPage
  ],
  entryComponents: [
    ClientFormComponent
  ]
})
export class ClientLogPageModule {}
