import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { DecimalPipe } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Firebase imports
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { environment } from '../environments/environment';

import { AuthModule } from './auth/auth.module';
import { ServiceWorkerModule } from '@angular/service-worker';

// // esto es para precargar la data antes que se inicie la aplicacion
// export function DataProviderFactory(provider: StaticDataService) {
//   return () => provider.getStaticData();
// }

import { Ng2ImgMaxModule } from 'ng2-img-max';

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule ,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // para la database de siempre
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features,
    AuthModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    Ng2ImgMaxModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DecimalPipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: StorageBucket, useValue: 'repmant-ce7a5.appspot.com' }
    // { provide: APP_INITIALIZER, useFactory: DataProviderFactory, deps: [StaticDataService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
