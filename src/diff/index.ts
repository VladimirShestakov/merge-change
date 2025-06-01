import { type } from '../type';
import { hasMethod } from '../has-method';
import type { ObjectValue } from '../common-types/types';
import { DiffOptions, DiffResult } from './types';

function isEqual(first: unknown, second: unknown): boolean {
  return first === second;
}

/**
 * Calculates the difference, the result is an object with $set and $unset operators
 * @param source {*} Source value
 * @param compare {*} Compared (new) value
 * @param [ignore] {Array<string>} Names of ignored properties
 * @param [white] {Array<string>} Names of compared properties, if the array is not empty
 * @param [path] {String} Path to the current property in recursive processing
 * @param [equal] {Function} Function for comparing values
 * @param separator
 * @param [result] {String} Returned result in recursive processing. Should not be used.
 * @returns {{$unset: [], $set: {}}}
 */
export function diff<S = unknown, C = unknown>(
  source: S,
  compare: C,
  { ignore = [], white = [], path = '', equal = isEqual, separator = '.' }: DiffOptions,
  result?: DiffResult,
): DiffResult | C {
  if (!result) result = { $set: {}, $unset: [] };

  // This is not JSON.stringify! We call a method that provides a value for conversion to JSON, but the conversion is not performed
  // Property types remain original, but we can compare the internals of custom objects
  const sourcePlain = hasMethod(source, 'toJSON') ? source.toJSON() : source;
  const comparePlain = hasMethod(compare, 'toJSON') ? compare.toJSON() : compare;

  const sourceType = type(sourcePlain);
  const compareType = type(comparePlain);
  if (sourceType === compareType && sourceType === 'object') {
    const sourceObject = sourcePlain as ObjectValue;
    const compareObject = comparePlain as ObjectValue;
    const sourceKeys = Object.keys(sourceObject);
    const compareKeys = Object.keys(compareObject);
    // set property
    for (const key of compareKeys) {
      const p = path ? path + separator + key : key;
      // If the property is not in the ignore list and if a whitelist is defined, then it is in it
      if (!ignore.includes(p) && (white.length === 0 || white.includes(p))) {
        // new property
        if (!(key in sourceObject)) {
          result.$set[p] = compareObject[key];
        } else if (!equal(compareObject[key], sourceObject[key])) {
          // change property
          diff(
            sourceObject[key],
            compareObject[key],
            {
              ignore,
              white,
              path: p,
              equal,
              separator,
            },
            result,
          );
        }
      }
    }
    // unset property
    for (const key of sourceKeys) {
      if (!(key in compareObject)) {
        const p = path ? path + separator + key : key;
        if (!ignore.includes(p) && (white.length === 0 || white.includes(p))) {
          result.$unset.push(p);
        }
      }
    }
  } else {
    if (!path) {
      return compare;
    } else {
      if (!ignore.includes(path) && (white.length === 0 || white.includes(path))) {
        result.$set[path] = compare;
      }
    }
  }
  return result;
}
