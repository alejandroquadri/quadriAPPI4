import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared';
import { ProdProgramPage } from './prod-program.page';

const routes: Routes = [
  {
    path: '',
    component: ProdProgramPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProdProgramPage]
})
export class ProdProgramPageModule {}
