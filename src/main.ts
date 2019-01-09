import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
// esto de abajo es para que el service worker sea registrado bien 
// info obtenida de https://stackoverflow.com/questions/50968902/angular-service-worker-swupdate-available-not-triggered
.then(() => {
  if ('serviceWorker' in navigator && environment.production) {
    navigator.serviceWorker.register('ngsw-worker.js');
  }
// aca termina, lo que sigue es default
}).catch(err => console.log(err));
