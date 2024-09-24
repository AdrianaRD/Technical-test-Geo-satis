import { TimezonePipe } from './timezone.pipe';
import moment from 'moment-timezone';

describe('TimezonePipe', () => {
  let pipe: TimezonePipe;

  beforeEach(() => {
    pipe = new TimezonePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a Date object to a formatted string in the given timezone', () => {
    const date = new Date('2023-09-25T12:00:00Z');
    const timezone = 'America/New_York';
    const transformed = pipe.transform(date, timezone);

    const expected = moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss');

    expect(transformed).toEqual(expected);
  });

  it('should transform a string date to a formatted string in the given timezone', () => {
    const dateString = '2023-09-25T12:00:00Z';
    const timezone = 'Europe/Madrid';
    const transformed = pipe.transform(dateString, timezone);

    const expected = moment(dateString).tz(timezone).format('YYYY-MM-DD HH:mm:ss');

    expect(transformed).toEqual(expected);
  });

  it('should return the date formatted for UTC if timezone is not provided', () => {
    const date = new Date('2023-09-25T12:00:00Z'); // Fecha en UTC
    const timezone = 'UTC';
    const transformed = pipe.transform(date, timezone);

    const expected = moment(date).tz('UTC').format('YYYY-MM-DD HH:mm:ss');

    expect(transformed).toEqual(expected);
  });

  it('should handle invalid date inputs gracefully', () => {
    const invalidDate = 'Invalid Date';
    const timezone = 'Europe/London';

    const transformed = pipe.transform(invalidDate, timezone);
    
    // If the date is invalid, Moment will return 'Invalid date' formatted string
    expect(transformed).toEqual('Invalid date');
  });
});
