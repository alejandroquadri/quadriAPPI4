import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  data: any;

  constructor(
    private apiData: ApiService
  ) {}

  getStaticData(): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.apiData.getObjectOnce('staticData')
      .then( ret => {
        this.data = ret.val();
        console.log('habemus static data', this.data);
        resolve(this.data);
      })
      .catch( err => {
        reject( err );
      })
    })
  }
}
