import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDeleted'
})
export class FilterDeletedPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
