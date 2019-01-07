import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared';
import { ManLogsComponent } from './man-logs/man-logs.component';
import { ManFormsComponent } from './man-forms/man-forms.component';
import { ManSignComponent } from './man-sign/man-sign.component';
import { SuppliesFormComponent } from './supplies-form/supplies-form.component';

const routes: Routes = [
  {
    path: 'carga-produccion',
    component: ManFormsComponent
  },
  {
    path: 'registros',
    component: ManLogsComponent
  },
  {
    path: 'cartel',
    component: ManSignComponent
  },
  {
    path: 'carga-insumos',
    component: SuppliesFormComponent
  },
  {
    path: 'carga-produccion/:id',
    component: ManFormsComponent
  },
];

@NgModule({
  declarations: [
    ManLogsComponent,
    ManFormsComponent,
    ManSignComponent,
    SuppliesFormComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ManufacturingModule { }
