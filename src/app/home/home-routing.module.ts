import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'tablero', pathMatch: 'full' },
      {
        path: 'tablero',
        loadChildren: './dashboard/dashboard.module#DashboardPageModule'
      },
      {
        path: 'registros-mantenimiento',
        loadChildren: './maintenance/maintenance.module#MaintenanceModule'
      },
      {
        path: 'compras',
        loadChildren: './procurement/procurement.module#ProcurementModule'
      },
      {
        path: 'programa-produccion',
        loadChildren: './prod-program/prod-program.module#ProdProgramPageModule'
      },
      {
        path: 'programa-entregas',
        loadChildren: './del-program/del-program.module#DelProgramPageModule'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
