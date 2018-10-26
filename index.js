/* @flow */

import formSerialize from 'form-serialize';

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

export function getFormDataWithSpec(serializedData: {}, formSpec: {}) {
  return Object.keys(serializedData).reduce((result, dataKey) => {
    const specType = formSpec[dataKey];
    const dataValue = serializedData[dataKey];
    return {
      ...result,
      [dataKey]: specType
        ? getSpecTypeValue(dataKey, dataValue, specType)
        : dataValue
    };
  }, {});
}

export default function getMeFormData($form: HTMLFormElement, formSpec: {}) {
  const serializedData = formSerialize($form, { hash: true, empty: true });
  const dataWithSpec = getFormDataWithSpec(serializedData, formSpec);
  return dataWithSpec;
}

const validatorFunctions = {
  required: value => hasValue(value)
};
/**
 * validateFormData - Function to check for validation errors in the form_data
 * form_data: {key:value}
 * validation_config: {
 *     field_name: {
 *         validator: String | Function ,
 *         message: String | Function,
 *         related_field: String - used only when using validator as function
 *     }
 * }
 *
 * validator: 'required' i.e keys inside the validatorFunctions
 * Validator function should only return boolean values
 *
 * **/
export function validateFormData(form_data: any, validation_config: any): {} {
  return reduce(
    validation_config,
    (result, { validator, message, related_field }, key) => {
      const isValidatorAFunction = isFunction(validator);
      const isMessageAFunction = isFunction(message);

      const field_data = form_data && form_data[key];
      let validation_message = message;
      let is_valid;

      if (isValidatorAFunction) {
        is_valid = validator(field_data, form_data[related_field]);
        //TODO: refactor this, is_valid should be always boolean
        if (isString(is_valid) && !isEmpty(is_valid)) {
          validation_message = is_valid;
          is_valid = false;
        }
        //    Predefined validator functions
      } else {
        is_valid = validatorFunctions[validator](field_data);
      }

      if (!is_valid)
        return {
          ...result,
          [key]:
            (isMessageAFunction ? message(field_data) : validation_message) ||
            FORM_TEXT.REQUIRED
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

export function getFormDataWithDateAsNumber(serialized_data: {}) {
  return reduce(
    serialized_data,
    (result, value, key) => {
      return {
        ...result,
        [key]: getDateAsNumberValue(key, value)
      };
    },
    {}
  );
}

export function getFormData($form: any) {
  const serialized_data = serialize($form, { hash: true });
  const serialized_data_with_date_as_number = getFormDataWithDateAsNumber(
    serialized_data
  );

  return serialized_data_with_date_as_number;
}
