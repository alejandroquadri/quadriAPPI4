import { NgModule } from '@angular/core';
import { HomePage } from './home.page';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    HomeRoutingModule,
    SharedModule,
  ],
  declarations: [
    HomePage,
  ],
})
export class HomePageModule {}
