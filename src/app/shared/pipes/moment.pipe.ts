import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

@Injectable()
@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: any, format: string): any {
    if (value) {
      return moment(value).format(format);
    } else {
      return;
    }
  }

}
