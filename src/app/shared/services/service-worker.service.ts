import { Injectable, isDevMode } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService {

  constructor(
    private updates: SwUpdate,
    public toastCtrl: ToastController
  ) {
    console.log('serviceW service boots');
    if (updates.isEnabled) {
      interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate()
        .then(() => console.log('checking for updates')));
    }
  }

  public checkForUpdates(): void {
    if (!isDevMode()) {
      this.updates.available.subscribe(event => this.promptUser());
    }
  }

  private promptUser(): void {
    console.log('updating to new version');
    this.updates.activateUpdate()
    .then( () => document.location.reload());
  }
}
