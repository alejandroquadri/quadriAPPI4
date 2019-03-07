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
        canActivate: [AuthGuard],
        loadChildren: './dashboard/dashboard.module#DashboardPageModule'
      },
      {
        path: 'registros-mantenimiento',
        canActivate: [AuthGuard],
        loadChildren: './maintenance/maintenance.module#MaintenanceModule'
      },
      {
        path: 'compras',
        canActivate: [AuthGuard],
        loadChildren: './procurement/procurement.module#ProcurementModule'
      },
      {
        path: 'programa-produccion',
        canActivate: [AuthGuard],
        loadChildren: './prod-program/prod-program.module#ProdProgramPageModule'
      },
      {
        path: 'programa-entregas',
        canActivate: [AuthGuard],
        loadChildren: './del-program/del-program.module#DelProgramPageModule'
      },
      {
        path: 'avion',
        canActivate: [AuthGuard],
        loadChildren: './avion/avion.module#AvionModule'
      },
      {
        path: 'crm',
        canActivate: [AuthGuard],
        loadChildren: './crm/crm.module#CrmModule'
      },
      {
        path: 'produccion',
        canActivate: [AuthGuard],
        loadChildren: './manufacturing/manufacturing.module#ManufacturingModule'
      },
      {
        path: 'perfil',
        canActivate: [AuthGuard],
        loadChildren: './profile/profile.module#ProfilePageModule'
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
