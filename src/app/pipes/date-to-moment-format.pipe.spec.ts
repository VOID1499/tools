import { DateToMomentFormatPipe } from './date-to-moment-format.pipe';

describe('DateToMomentFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new DateToMomentFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
