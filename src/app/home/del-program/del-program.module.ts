import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared';

import { DelProgramPage } from './del-program.page';

const routes: Routes = [
  {
    path: '',
    component: DelProgramPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DelProgramPage]
})
export class DelProgramPageModule {}
