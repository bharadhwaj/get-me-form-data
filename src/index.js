/* @flow */

import formSerialize from 'form-serialize';
import { isEmpty, isNumber, isFunction, reduce, isString } from 'lodash';

export const TEXT = {
  REQUIRED: 'This is required'
};

function getSpecTypeValue(key, value, specType: 'date' | 'boolean' | 'text') {
  switch (specType) {
    case 'date':
      return Number(value);
    case 'boolean':
      return value === 'on';

    default:
      return value;
  }
}

export function getFormDataWithSpec(serializedData: {}, formSpec: {} = {}) {
  return Object.keys(serializedData).reduce((result, dataKey) => {
    const specType = formSpec[dataKey] && formSpec[dataKey].type;
    const dataValue = serializedData[dataKey];
    return {
      ...result,
      [dataKey]: specType
        ? getSpecTypeValue(dataKey, dataValue, specType)
        : dataValue
    };
  }, {});
}

function hasValue(value) {
  if (!value) return false;
  if (isNumber(value)) return true;

  if (!isEmpty(value)) return true;

  return false;
}

const validatorFunctions = {
  required: value => hasValue(value)
};

/**
 * validateFormData - Function to check for validation errors in the formData
 * formData: {key:value}
 * validationConfig: {
 *     field_name: {
 *         validator: String | Function ,
 *         message: String | Function,
 *         relatedField: String - used only when using validator as function
 *     }
 * }
 *
 * validator: 'required' i.e keys inside the validatorFunctions
 * Validator function should only return boolean values
 *
 * **/

export function validateFormData(formData: any, validationConfig: any): {} {
  return reduce(
    validationConfig,
    (result, { validator, message, relatedField }, key) => {
      const isValidatorAFunction = isFunction(validator);
      const isMessageAFunction = isFunction(message);

      const fieldData = formData && formData[key];
      let isValid;

      if (isValidatorAFunction) {
        isValid = validator(fieldData, formData[relatedField]);
      } else {
        isValid = validatorFunctions[validator](fieldData);
      }

      if (!isValid)
        return {
          ...result,
          [key]:
            (isMessageAFunction ? message(fieldData) : message) || TEXT.REQUIRED
        };

      return result;
    },
    {}
  );
}

function getDateAsNumberValue(key, value) {
  const isDateInput = key.indexOf('-date') > -1 && isString(value);
  if (isDateInput) {
    return Number(value);
  }
  return value;
}

export function getFormDataWithDateAsNumber(serializedData: {}) {
  return reduce(
    serializedData,
    (result, value, key) => {
      return {
        ...result,
        [key]: getDateAsNumberValue(key, value)
      };
    },
    {}
  );
}

export default function getMeFormData(
  $form: HTMLFormElement,
  formSpec: {} = {}
) {
  const serializedData = formSerialize($form, { hash: true, empty: true });
  const dataWithSpec = getFormDataWithSpec(serializedData, formSpec);
  const errors = validateFormData(dataWithSpec, formSpec);

  return {
    data: dataWithSpec,
    errors
  };
}
