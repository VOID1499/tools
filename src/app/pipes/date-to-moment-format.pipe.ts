import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import 'moment/locale/es';

@Pipe({
  name: 'dateToMomentFormat'
})
export class DateToMomentFormatPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return moment(value).format("dddd DD [de] MMMM").toUpperCase();
  }

}
