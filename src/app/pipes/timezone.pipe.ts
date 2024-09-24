import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-timezone';

@Pipe({
  name: 'timezone',
  standalone: true,
})
export class TimezonePipe implements PipeTransform {

  transform(value: Date | string, timezone: string): string {
    return moment(value).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
  }

}
