import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ProfilePage } from './profile.page';
import { SharedModule } from '../../shared';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ProfilePage
  ]
})
export class ProfilePageModule {}
