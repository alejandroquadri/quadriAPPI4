import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplitService {

  disSplit = true;

  private disableSubject = new ReplaySubject(1);
  public disableObs = this.disableSubject.asObservable();

  constructor() {
    this.disableSubject.next(this.disSplit);
   }

  updateSplitShow(show?: boolean) {
    if (show) {
      this.disSplit = show;
    } else {
      this.disSplit = !this.disSplit;
    }
    this.disableSubject.next(this.disSplit);
  }
}
