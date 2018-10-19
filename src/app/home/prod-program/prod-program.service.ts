import { Injectable } from '@angular/core';
import { ApiService, StaticDataService } from '../../shared';
import * as moment from 'moment';
import 'moment/locale/es';

@Injectable({
  providedIn: 'root'
})
export class ProdProgramService {

  staticData: any;

  constructor(
    private api: ApiService,
    private staticDataP: StaticDataService
    ) {
    this.staticData = this.staticDataP.data.produccion;
  }

  getProgram() {
    return this.api.getObject('program');
  }

  addNew(form: any) {
    const date = moment(form.date).format('YYYYMMDD');
    const mach = form.machine;
    const key = this.api.getNewKey();
    // tslint:disable-next-line:max-line-length
    const code = `${this.staticData.codebuilder.drawing[form.drawing]}${this.staticData.codebuilder.color[form.color]}${this.staticData.codebuilder.dim[form.dim]}`;
    const info = {
      color: form.color,
      dim: form.dim,
      drawing: form.drawing,
      codigo: code,
      observacion: form.obs,
      valor: form.quantity,
      unidad: form.unit
    };
    return this.api.updateObject(`program/${date}/${mach}/${key}`, info);
  }

  update(form, key, diff: string) {
    const date = moment(form.date).format('YYYYMMDD');
    const mach = form.machine;
    // tslint:disable-next-line:max-line-length
    const code = `${this.staticData.codebuilder.drawing[form.drawing]}${this.staticData.codebuilder.color[form.color]}${this.staticData.codebuilder.dim[form.dim]}`;
    const info = {
      color: form.color,
      dim: form.dim,
      drawing: form.drawing,
      codigo: code,
      observacion: form.obs,
      valor: form.quantity,
      unidad: form.unit
    };
    if (diff === 'date') {
      const fanObj = this.api.fanOutObject(info, [`program/${date}/${mach}`], true);
      fanObj[`program/${form.oldDate}/${form.oldMach}/${key}`] = null;
      return this.api.fanUpdate(fanObj);

    } else if (diff === 'mach') {
      const fanObj = this.api.fanOutObject(info, [`program/${date}/${mach}`], true);
      fanObj[`program/${date}/${form.oldMach}/${key}`] = null;
      return this.api.fanUpdate(fanObj);
    } else {
      return this.api.updateObject(`program/${date}/${mach}/${key}`, info);
    }
  }

  remove(form, key) {
    const date = moment(form.date).format('YYYYMMDD');
    const mach = form.machine;
    return this.api.removeItemList(`program/${date}/${mach}`, key);
  }

  getEntregas() {
    return this.api.get('entregas');
  }

  getNPPendientes() {
    return this.api.get('np');
  }

  getScProgram() {
    return this.api.getListMeta('sc-program');
  }

  pushNewScProg(form) {
    return this.api.push('sc-program', form);
  }

  updateScProg(form, key) {
    return this.api.updateList('sc-program', key, form);
  }

  deconsteScProg(key) {
    return this.api.removeItemList('sc-program', key);
  }

  deleteScProg(key) {
    return this.api.removeItemList('sc-program', key);
  }

}
