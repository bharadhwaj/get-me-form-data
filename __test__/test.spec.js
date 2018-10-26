import { getFormDataWithSpec } from '../index';

describe('getFormDataWithSpec', () => {
  it('should the data for date', () => {
    const data = getFormDataWithSpec(
      {
        myDate: '11111'
      },
      {
        myDate: 'date'
      }
    );
    expect(data).toEqual({ myDate: 11111 });
  });

  it('should the data for date', () => {
    const data = getFormDataWithSpec(
      {
        myCheckbox: 'on'
      },
      {
        myCheckbox: 'boolean'
      }
    );
    expect(data).toEqual({ myCheckbox: true });
  });
});
