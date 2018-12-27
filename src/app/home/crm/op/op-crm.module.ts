import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared';
import { OpLogPage } from './op-log/op-log.page';
import { OpDetailPage } from './op-detail/op-detail.page';
import { OpFiltersPage } from './op-filters/op-filters.page';

import { CrmSharedModule, AddOpPage, EmailPspComponent, ClientFormComponent } from '../shared';

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
    CrmSharedModule
  ],
  declarations: [
    OpLogPage,
    OpDetailPage,
    OpFiltersPage
  ],
  entryComponents: [
    OpFiltersPage,
    AddOpPage,
    EmailPspComponent,
    ClientFormComponent
  ]

})
export class OpCrmModule { }
