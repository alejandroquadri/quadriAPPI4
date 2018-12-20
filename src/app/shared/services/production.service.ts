import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {

  constructor(
    private api: ApiService
  ) { }

  getProduction() {
    return this.api.getList('production');
  }

}
