import { type } from '../type';

/**
 * Converts a data structure through recursive calls to toPlain or toJSON methods if they exist for each value.
 * If the method doesn't exist, the original value is returned.
 * Values for which there is no call method will remain in their original value.
 * @param value {*} Value for conversion
 * @param [recursive] {Boolean} Perform nested processing
 * @returns {*}
 */
export function plain(value: any, recursive = true): any {
  if (value === null || typeof value === 'undefined') {
    return value;
  } else if (typeof value.toJSON === 'function') {
    value = value.toJSON();
  } else {
    //value = value.valueOf();
  }
  if (recursive) {
    if (Array.isArray(value)) {
      return value.map((item) => plain(item));
    } else if (type(value) === 'object') {
      const result: any = {};
      for (const [key, item] of Object.entries(value)) {
        result[key] = plain(item);
      }
      return result;
    }
  }
  return value;
}
