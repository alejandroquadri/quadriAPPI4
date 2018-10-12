import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'objNgfor',
})
export class ObjNgforPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
      // console.log(Object.keys(value))
      return Object.keys(value); // .map(key => value[key]);
    }
}

