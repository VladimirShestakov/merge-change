import { get } from '../get';
import { set } from '../set';
import { unset } from '../unset';
import { type } from '../type';
import { OperationFn, Operations } from './types';
import type { ObjectValue, PropertyPath } from '../common-types/types';

export const defaultOperations: Record<Operations, OperationFn> = {
  /**
   * $set
   * @param source
   * @param params Object with properties that need to be added without merging. Property keys can be paths taking into account nesting
   * @returns {boolean}
   */
  $set(source: ObjectValue, params: ObjectValue): boolean {
    const fieldNames = Object.keys(params);
    for (const fieldName of fieldNames) {
      set(source, fieldName, params[fieldName]);
    }
    return fieldNames.length > 0;
  },

  /**
   * $unset
   * Removing object properties or array elements.
   * @param source
   * @param params Array of paths to properties to be removed. Nesting is taken into account
   * @returns {boolean}
   */
  $unset(source: ObjectValue, params: PropertyPath[]): boolean {
    if (Array.isArray(params)) {
      // List of fields to remove
      for (const fieldName of params) {
        unset(source, fieldName as string);
      }
      return params.length > 0;
    }
    return false;
  },

  /**
   * $leave
   * Removing all properties or elements except those specified
   * @param source
   * @param propPaths Array of properties that should not be removed
   * @returns {boolean}
   */
  $leave(source: unknown, propPaths: string[]): boolean {
    if (Array.isArray(propPaths)) {
      const names: Record<string, string[]> = {};
      for (const propPath of propPaths) {
        const [name, subPath] = propPath.split('.');
        if (!names[name]) {
          names[name] = [];
        }
        if (subPath) {
          names[name].push(subPath);
        }
      }
      const sourceType = type(source);
      if (sourceType === 'object') {
        const sourceValue = source as ObjectValue;
        const keys = Object.keys(sourceValue);
        for (const key of keys) {
          if (!names[key]) {
            delete sourceValue[key];
          } else if (names[key].length > 0) {
            defaultOperations.$leave(sourceValue[key], names[key]);
          }
        }
      } else if (sourceType === 'Array') {
        const sourceValue = source as Array<unknown>;
        for (let key = sourceValue.length - 1; key >= 0; key--) {
          if (!(key in names)) {
            sourceValue.splice(key, 1);
          }
        }
      }
      return propPaths.length > 0;
    }
    return false;
  },

  /**
   * $pull
   * Removing elements by value equality
   * @param source
   * @param params
   * @returns {boolean}
   */
  $pull(source: ObjectValue, params: Record<PropertyPath, unknown>): boolean {
    const paths = Object.keys(params);
    for (const path of paths) {
      const cond = params[path];
      const array = get(source, path, []);
      if (Array.isArray(array)) {
        for (let i = array.length - 1; i >= 0; i--) {
          if (cond === array[i]) {
            array.splice(i, 1);
          }
        }
      } else {
        throw new Error('Cannot pull on not array');
      }
    }
    return paths.length > 0;
  },

  /**
   * $push
   * Adding an element
   * @param source
   * @param params
   * @returns {boolean}
   */
  $push(source: ObjectValue, params: Record<PropertyPath, unknown>): boolean {
    const paths = Object.keys(params);
    for (const path of paths) {
      const value = params[path];
      const array = get(source, path, []);
      if (Array.isArray(array)) {
        array.push(value);
        set(source, path, array);
      } else {
        throw new Error('Cannot push on not array');
      }
    }
    return paths.length > 0;
  },

  /**
   * $concat
   * Merging array elements
   * @param source
   * @param params
   * @returns {boolean}
   */
  $concat(source: ObjectValue, params: Record<PropertyPath, unknown>): boolean {
    const paths = Object.keys(params);
    for (const path of paths) {
      const value = params[path];
      let array = get(source, path, []);
      if (Array.isArray(array)) {
        array = array.concat(value);
        set(source, path, array);
      } else {
        throw new Error('Cannot concat on not array');
      }
    }
    return paths.length > 0;
  },
};

/**
 * Checking if a declarative operation exists
 * @param operation
 * @param operations
 * @returns {boolean}
 */
export function isOperation(
  operation: unknown,
  operations: Record<string, OperationFn> = defaultOperations,
): operation is Operations {
  return typeof operation === 'string' && operation in operations;
}

/**
 * Extract operations from object
 * @param object
 * @param operations
 * @returns {Object}
 */
export function extractOperations<T extends Record<string, unknown>>(
  object: T,
  operations: Record<string, OperationFn> = defaultOperations,
): Partial<T> {
  const result: Partial<T> = {};
  const keys = Object.keys(object) as Array<keyof T>;
  for (const key of keys) {
    if (isOperation(key, operations)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      result[key] = object[key];
      delete object[key];
    }
  }
  return result;
}
