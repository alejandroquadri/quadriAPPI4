import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PspLogPage } from './psp-log/psp-log.page';
import { PspDetailPage } from './psp-detail/psp-detail.page';
import { SharedModule } from '../../../shared';
import { AddOpPage } from '../shared/add-op/add-op.page';
import { CrmSharedCModule } from '../shared/crm-shared.module';

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
    CrmSharedCModule
  ],
  declarations: [
    PspLogPage,
    PspDetailPage
  ],
  entryComponents: [
    PspDetailPage,
    AddOpPage
  ]
})
export class PspCrmModule { }
