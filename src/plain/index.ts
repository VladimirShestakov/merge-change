import { type } from '../type';
import { hasMethod } from '../has-method';
import type { ObjectValue } from '../common-types/types';
import type { Plain } from './types';

/**
 * Converts a data structure through recursive calls to toJSON methods if they exist for each value.
 * If the method doesn't exist, the original value is returned.
 * Values for which there is no call method will remain in their original value.
 * @param value Value for conversion
 * @param recursive Perform nested processing
 * @returns The converted value
 */
export function plain<T>(value: T, recursive = true): Plain<T> {
  if (value === null || typeof value === 'undefined') {
    return value as Plain<T>;
  } else if (hasMethod(value, 'toJSON')) {
    value = value.toJSON() as T;
  }

  if (recursive) {
    if (Array.isArray(value)) {
      return value.map((item) => plain(item)) as Plain<T>;
    } else if (type(value) === 'object') {
      const result: ObjectValue = {};
      for (const [key, item] of Object.entries(value as object)) {
        result[key] = plain(item);
      }
      return result as Plain<T>;
    }
  }

  return value as Plain<T>;
}
