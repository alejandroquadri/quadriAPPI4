import { Injectable, isDevMode } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService {

  update$ = new Subject();

  constructor(
    private updates: SwUpdate,
  ) {
    // console.log('serviceW service boots');
    if (updates.isEnabled) {
      interval(6 * 60 * 60)
      .subscribe(() => {
        updates.checkForUpdate()
        // .then(() => console.log('checking for updates'))
      });
    }
  }

  public checkForUpdates(): void {
    if (!isDevMode()) {
      this.updates.available.subscribe(event => this.promptUser());
    }
  }

  promptUser(): void {
    this.update$.next(true);
    // this.updates.activateUpdate()
    // .then( () => document.location.reload());
  }

  updateVersion() {
    console.log('updating to new version');
    this.updates.activateUpdate()
    .then( () => document.location.reload());
  }
}
