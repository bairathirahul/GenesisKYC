import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterDeleted',
  pure: false
})
export class FilterDeletedPipe implements PipeTransform {

  transform(objects: any[]): any[] {
    if (!objects) {
      return objects;
    }
    return objects.filter(object => object.deleted === false);
  }

}
