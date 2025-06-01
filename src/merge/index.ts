import {
  MergeChangeFn,
  MergeChangeKind,
  MergedAll,
  MergeMethodName,
  MergeMethods,
  Operations,
} from './types';
import { type } from '../type';
import { defaultOperations, extractOperations, isOperation } from './operations';
import { ObjectValue } from '../common-types/types';

// Default methods for handling different type combinations
const defaultMethods: MergeMethods = {
  unknown_unknown(first: any, second: any, kind: MergeChangeKind, mc: MergeChangeFn) {
    return mc(undefined, second);
  },
  unknown_undefined(first: any, second: undefined, kind: MergeChangeKind, mc: MergeChangeFn) {
    return mc(undefined, first);
  },
  undefined_unknown(first: undefined, second: any) {
    return second;
  },
  undefined_Date(first: undefined, second: Date, kind: MergeChangeKind) {
    return kind === MergeChangeKind.MERGE ? new Date(second) : second;
  },
  undefined_Set<T extends Set<any>>(first: undefined, second: T, kind: MergeChangeKind): T {
    return kind === MergeChangeKind.MERGE ? (new Set(second) as T) : second;
  },
  undefined_Map<T extends Map<any, any>>(first: undefined, second: T, kind: MergeChangeKind): T {
    return kind === MergeChangeKind.MERGE ? (new Map(second) as T) : second;
  },
  undefined_Array(first: undefined, second: any[], kind: MergeChangeKind, mc: MergeChangeFn) {
    return kind === MergeChangeKind.MERGE
      ? defaultMethods.Array_Array!([], second, kind, mc)
      : second;
  },
  undefined_object(
    first: undefined,
    second: ObjectValue,
    kind: MergeChangeKind,
    mc: MergeChangeFn,
  ) {
    const operations = extractOperations(second);
    return defaultMethods.object_object!(second, operations, kind, mc);
  },
  object_object(first: any, second: any, kind: MergeChangeKind, mc: MergeChangeFn) {
    const result = kind === MergeChangeKind.PATCH ? first : {};
    let resultField;
    let isChange = kind === MergeChangeKind.MERGE;
    const operations: [Operations, any][] = [];
    const keysFirst = Object.keys(first);
    const keysSecond = new Set(Object.keys(second));
    for (const key of keysFirst) {
      if (key in second) {
        resultField = mc(first[key], second[key]);
        keysSecond.delete(key);
      } else {
        resultField = mc(first[key], undefined);
      }
      isChange = isChange || resultField !== first[key];
      result[key] = resultField;
    }
    for (const key of keysSecond) {
      if (isOperation(key)) {
        operations.push([key, second[key]]);
      } else {
        resultField = mc(undefined, second[key]);
        isChange = isChange || resultField !== first[key];
        result[key] = resultField;
      }
    }
    // execute declarative operations
    for (const [operation, params] of operations) {
      isChange = defaultOperations[operation](result, params) || isChange;
    }
    return isChange ? result : first;
  },
  Array_Array(first: any[], second: any[], kind: MergeChangeKind, mc: MergeChangeFn) {
    if (kind === MergeChangeKind.MERGE) {
      return second.map((item: unknown) => mc(undefined, item));
    }
    return second;
  },
};

function createMergeChange(kind: MergeChangeKind, customMethods: MergeMethods = {}) {
  const methods: MergeMethods = { ...defaultMethods, ...customMethods };

  const mergeChange = <T extends any[]>(...values: T): MergedAll<T> => {
    return values.reduce((first: any, second: any) => {
      const firstType = type(first);
      const secondType = type(second);
      const actions: MergeMethodName[] = [
        `${firstType}_${secondType}`,
        `${firstType}_unknown`,
        `unknown_${secondType}`,
        `unknown_unknown`,
      ];
      for (const action of actions) {
        if (methods[action]) {
          return methods[action](first, second, kind, mergeChange);
        }
      }
      return first;
    });
  };

  return mergeChange;
}

// Factory functions for the three merge types
export function createMerge(customMethods: MergeMethods = {}) {
  return createMergeChange(MergeChangeKind.MERGE, customMethods);
}

export function createUpdate(customMethods: MergeMethods = {}) {
  return createMergeChange(MergeChangeKind.UPDATE, customMethods);
}

export function createPatch(customMethods: MergeMethods = {}) {
  return createMergeChange(MergeChangeKind.PATCH, customMethods);
}

export const merge = createMerge();

export const update = createUpdate();

export const patch = createPatch();

export default { merge, update, patch };
