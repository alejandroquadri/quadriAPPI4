import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LoggerService } from '../../auth/shared/logger.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  constructor(
    private api: ApiService,
    private authData: LoggerService
  ) { }

  getAvionList() {
    return this.api.getListMeta('finance/avion');
  }

  pushRecord(form) {
    let user = {
      uid: this.authData.current.uid,
      email: this.authData.current.email,
      displayName: this.authData.current.displayName,
    }
    form['user'] = user;
    form['timestamp'] = this.api.timestamp();
    return this.api.push('finance/avion', form);
  }

  deleteRecord(key: string) {
    return this.api.removeItemList('finance/avion', key);
  }

  updateRecord(form: any, key: string) {
    return this.api.updateList('finance/avion', key, form);
  }

}
