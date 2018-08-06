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

  // showChange() {
  //   this.disSplit = !this.disSplit;
  //   console.log('service', this.disSplit);
  //   return this.disSplit;
  // }

  // showto(state: boolean) {
  //   this.disSplit = state;
  // }

  // shouldShow() {
  //   console.log(this.platform.width());
  //   let width;
  //   if (this.platform.width() > 1200) {
  //     width = true;
  //   } else {
  //     width = false;
  //   }
  //   return width && this.disSplit;
  // }

  // showMenuToggle() {
  //   let width;
  //   if (this.platform.width() > 1200) {
  //     width = true;
  //   } else {
  //     width = false;
  //   }
  //   return !width;
  // }

  updateSplitShow(show?: boolean) {
    if (show) {
      this.disSplit = show;
    } else {
      this.disSplit = !this.disSplit;
    }
    this.disableSubject.next(this.disSplit);
  }
}
