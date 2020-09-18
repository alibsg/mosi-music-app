import { PipeTransform, Pipe } from '@angular/core';
import { formatNumber } from '@angular/common';
@Pipe({
  name: 'filesize'
})
export class FileSizePipe implements PipeTransform {
  endings = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  transform(value: number) {
    let remaining = value;
    let itteration = 0;
    let res: string;
    remaining = Math.floor(value / 1024);
    while (remaining !== 0) {
      value = value / 1024;
      remaining = Math.floor(value / 1024);
      itteration++;
    }
    res = formatNumber(value , 'en-US', '1.0-2') + this.endings[itteration];
    return res;
  }
}
