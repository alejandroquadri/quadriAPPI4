import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(array: Array<any>, field: string, asc: boolean, fb: boolean): Array<any> {
    if (array) {
      if (asc) {
        if (field === '') {
          array.sort((a: any, b: any) => {
            if (a < b) {
              return -1;
            } else if (a > b) {
              return 1;
            } else {
              return 0;
            }
          });
          return array;
        } else {
          array.sort((a: any, b: any) => {
            if (fb) {
              a = a.payload.val();
              b = b.payload.val();
            }
            if (a[field] < b[field]) {
              return -1;
            } else if (a[field] > b[field]) {
              return 1;
            } else {
              return 0;
            }
          });
          return array;
        }
      } else {
        if (field === '') {
          array.sort((a: any, b: any) => {
            if (a > b) {
              return -1;
            } else if (a < b) {
              return 1;
            } else {
              return 0;
            }
          });
          return array;
        } else {
          array.sort((a: any, b: any) => {
            if (fb) {
              a = a.payload.val();
              b = b.payload.val();
            }
            if (a[field] > b[field]) {
              return -1;
            } else if (a[field] < b[field]) {
              return 1;
            } else {
              return 0;
            }
          });
          return array;
        }
      }
    } else { return[]; }
  }

}
