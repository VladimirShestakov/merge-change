import { type } from '../type';
import { hasMethod } from '../has-method';
import type { ObjectValueDeep } from '../common-types/types';
import type { FlatObject } from './types';

/**
 * Converting a nested structure to a flat one
 * Property names are transformed into a path {a: {b: 0}} => {'a.b': 0}
 * @param value {object|*} Source objects for conversion
 * @param separator
 * @param [path] {string} Base path for forming keys of the flat object. Used for recursion.
 * @param [clearUndefined] {boolean} Flag indicating whether to add undefined values to the result
 * @param [result] {object} Result - flat object. Passed by reference for recursion
 * @returns {{}}
 */
export function flat<V, S extends string = '.', P extends string = '', R = FlatObject<V, S>>(
  value: V,
  separator: S = '.' as S,
  clearUndefined: boolean = false,
  path: P = '' as P,
  result: R = {} as R,
): R {
  if (hasMethod(value, 'toJSON')) value = value.toJSON() as V;
  if (type(value) === 'object') {
    const valueObject = value as ObjectValueDeep;
    for (const [key, item] of Object.entries(valueObject)) {
      flat(item, separator, clearUndefined, path ? `${path}${separator}${key}` : key, result);
    }
  } else if (!clearUndefined || typeof value !== 'undefined') {
    if (path === '') {
      result = value as unknown as R;
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      result[path] = value;
    }
  }
  return result;
}
