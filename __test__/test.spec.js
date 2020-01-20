import { isEmpty } from 'lodash';
import { getFormDataWithSpec, validateFormData, TEXT } from '../src/index';

describe('getFormDataWithSpec', () => {
  it('should handle when spec is passed to the getFormDataWithSpec', () => {
    const data = getFormDataWithSpec({
      myDate: '11111'
    });
    expect(data).toEqual({ myDate: '11111' });
  });

  it('should handle data for date', () => {
    const data = getFormDataWithSpec(
      {
        myDate: '11111'
      },
      {
        myDate: {
          type: 'date'
        }
      }
    );
    expect(data).toEqual({ myDate: 11111 });
  });

  it('should handle data for boolean fields for checkbox', () => {
    const data = getFormDataWithSpec(
      {
        myCheckbox: 'on'
      },
      {
        myCheckbox: {
          type: 'boolean'
        }
      }
    );
    expect(data).toEqual({ myCheckbox: true });
  });

  it('should handle data for boolean fields for string value "true" ', () => {
    const data = getFormDataWithSpec(
      {
        mySelectOption: 'true'
      },
      {
        mySelectOption: {
          type: 'boolean'
        }
      }
    );
    expect(data).toEqual({ mySelectOption: true });
  });
});

describe('validateFormData', () => {
  it('should handle empty validator', () => {
    const formData = {
      missing_placeholders: ['a'],
      name: 'Hello'
    };

    expect(validateFormData(formData)).toEqual({});
  });

  it('should return errors for the form', () => {
    const validatorConfig = {
      missing_placeholders: {
        validator: isEmpty,
        message: 'Abcd'
      },
      name: {
        validator: 'required'
      },
      offer_signatory: {
        validator: 'required'
      }
    };
    const formData = {
      missing_placeholders: ['a'],
      name: 'Hello'
    };

    const expected = {
      missing_placeholders: 'Abcd',
      offer_signatory: TEXT.REQUIRED
    };

    expect(validateFormData(formData, validatorConfig)).toEqual(expected);
  });

  it('should return no error when validatorConfig is empty/null', () => {
    const formData = {
      name: 'Hello'
    };

    expect(validateFormData(formData, null)).toEqual({});
    expect(validateFormData(formData, {})).toEqual({});
  });

  it('should return errors when formData is empty/null', () => {
    const validatorConfig = {
      missing_placeholders: {
        validator: 'required'
      }
    };
    const expected = {
      missing_placeholders: TEXT.REQUIRED
    };

    expect(validateFormData({}, validatorConfig)).toEqual(expected);
    expect(validateFormData(null, validatorConfig)).toEqual(expected);
  });

  it('should return validate number', () => {
    const validatorConfig = {
      date: {
        validator: 'required'
      }
    };

    expect(validateFormData({ date: 12 }, validatorConfig)).toEqual({});
  });

  it('should handle data with validator', () => {
    const validatorConfig = {
      date: {
        type: 'boolean'
      }
    };
    expect(validateFormData({ date: 12 }, validatorConfig)).toEqual({});
  });
});
