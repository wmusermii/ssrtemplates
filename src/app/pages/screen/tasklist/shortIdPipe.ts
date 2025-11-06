import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortId',
  standalone: true
})
export class ShortIdPipe implements PipeTransform {
  transform(value: string, length = 3): string {
    if (!value) return '';
    return value.length > length ? value.substring(0, length) + '...' : value;
  }
}
