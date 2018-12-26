import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared';
import { OpLogPage } from './op-log/op-log.page';
import { OpDetailPage } from './op-detail/op-detail.page';
import { OpFiltersPage } from './op-filters/op-filters.page';
import { AddOpPage } from '../shared/add-op/add-op.page';
import { CrmSharedCModule } from '../shared/crm-shared.module';

const routes: Routes = [
  {
    path: '',
    component: OpLogPage
  },
  {
    path: ':id',
    component: OpDetailPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CrmSharedCModule
  ],
  declarations: [
    OpLogPage,
    OpDetailPage,
    OpFiltersPage
  ],
  entryComponents: [
    OpFiltersPage,
    AddOpPage
  ]

})
export class OpCrmModule { }
