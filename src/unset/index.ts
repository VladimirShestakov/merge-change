import { type } from '../type';
import { splitPath } from '../split-path';
import {
  ExtractPathsAny,
  ExtractPathsAsterisk,
  ObjectValue,
  PropertyParts,
} from '../common-types/types';

export function unset<
  D,
  P extends ExtractPathsAny<D, S> | ExtractPathsAsterisk<D, S>,
  S extends string = '.',
>(value: D, path: P | PropertyParts, separator: S = '.' as S): D {
  if (value === null || typeof value === 'undefined') return value;
  if (typeof path === 'number') path = [path];
  if (!path) return value;
  if (typeof path === 'string') return unset(value, splitPath(path, separator), separator);

  const currentPath = path[0];

  if (currentPath === '*') {
    const t = type(value);
    // Clearing all object properties
    if (t === 'object') {
      const source = value as unknown as ObjectValue;
      const keys = Object.keys(source);
      for (const key of keys) {
        delete source[key];
      }
    } else if (t === 'Array') {
      const arr = value as unknown as Array<unknown>;
      arr.splice(0, arr.length);
    }
    return value;
  }

  if (path.length === 1) {
    if (Array.isArray(value)) {
      const arr = value as unknown as Array<unknown>;
      if (typeof currentPath === 'number') {
        arr.splice(currentPath, 1);
      }
    } else {
      const obj = value as unknown as ObjectValue;
      delete obj[currentPath];
    }
  } else {
    const obj = value as unknown as ObjectValue;
    const nextValue = obj[currentPath];
    const t = type(nextValue);
    if (path[1] === '*' && t !== 'object' && t !== 'Array') {
      obj[currentPath] = undefined;
    } else {
      return unset(nextValue as unknown as D, path.slice(1), separator);
    }
  }
  return value;
}
