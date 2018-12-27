import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PspLogPage } from './psp-log/psp-log.page';
import { PspDetailPage } from './psp-detail/psp-detail.page';
import { SharedModule } from '../../../shared';

import { CrmSharedModule,
        AddOpPage,
        EmailPspComponent,
        ClientFormComponent } from '../shared';

const routes: Routes = [
  {
    path: '',
    component: PspLogPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CrmSharedModule
  ],
  declarations: [
    PspLogPage,
    PspDetailPage
  ],
  entryComponents: [
    PspDetailPage,
    AddOpPage,
    EmailPspComponent,
    ClientFormComponent
  ]
})
export class PspCrmModule { }
