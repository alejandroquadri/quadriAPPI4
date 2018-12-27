import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityLogPage } from './activity-log.page';
import { SharedModule } from '../../../../shared';
import { AddOpPage, OpSelectPage, CrmSharedModule } from '../../shared';

const routes: Routes = [
  {
    path: '',
    component: ActivityLogPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CrmSharedModule
  ],
  declarations: [
    ActivityLogPage
  ],
  entryComponents: [
    AddOpPage,
    OpSelectPage
  ]
})
export class ActivityLogPageModule {}
