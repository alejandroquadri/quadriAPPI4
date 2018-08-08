import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable()
@Pipe({
  name: 'wordFilter'
})
export class WordFilterPipe implements PipeTransform {

  transform(array: any[], term: string, fb: boolean) {
    if (array) {
      return array.filter( object => {
        return (this.filterSearch(object, term, fb));
      });
    }
  }

  filterSearch(object, term, fb) {
    if (term === '') {
      return true;
    } else {
      let arrayKeys;
      if (fb) {
          arrayKeys = Object.keys(object.payload.val());
        } else {
          arrayKeys = Object.keys(object);
        }
      for (let i = 0 ; i < arrayKeys.length ; i++) {
        let item;
        if (fb) {
          item = object.payload.val()[arrayKeys[i]];
        } else {
          item = object[arrayKeys[i]];
        }
        if (typeof item === 'string') {
          if (item.toLowerCase().indexOf(term.toLowerCase()) > -1) {
            return true;
          }
        }
      }
    }
  }

}
