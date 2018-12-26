import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared';

const routes: Routes = [
  // {
  //   path: '',
  //   component: AvionLogPage
  // }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    // AvionLogPage,
    // AvionFormPage
  ],
  entryComponents: [
    // AvionFormPage
  ]
})
export class OpCrmModule { }
