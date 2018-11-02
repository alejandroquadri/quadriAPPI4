import { NgModule } from '@angular/core';
import { HomePage } from './home.page';
import { HomeRoutingModule } from './home-routing.module';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    HomeRoutingModule,
    IonicModule,
    CommonModule
  ],
  declarations: [
    HomePage,
  ],
})
export class HomePageModule {}
