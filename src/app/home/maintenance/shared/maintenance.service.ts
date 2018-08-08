import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(
    private api: ApiService
  ) { }

  pushMachineLog(form: any) {
    return this.api.push('machineLogs', form);
  }

  getMachineLogs() {
    return this.api.getList('machineLogs');
  }

  getMachineLogsMeta() {
    return this.api.getListMeta('machineLogs');
  }

  deleteLog(key) {
    return this.api.removeItemList('machineLogs', key);
  }

  updateLog(key, form) {
    return this.api.updateList('machineLogs', key, form);
  }
}
