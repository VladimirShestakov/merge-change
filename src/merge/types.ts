import { Type } from '../type/types';
import { ExtractPaths } from '../common-types/types';
import { FlatObject } from '../flat/types';

export enum Operations {
  '$set' = '$set',
  '$unset' = '$unset',
  '$leave' = '$leave',
  '$pull' = '$pull',
  '$push' = '$push',
  '$concat' = '$concat',
}

export type OperationFn = (source: any, params: any) => boolean;

export enum MergeChangeKind {
  MERGE = 'merge', // cloning
  PATCH = 'patch', // change in source value
  UPDATE = 'update', //immutable update (new value if there are diffs)
}

export type MergeMethodName = `${Type}_${Type}`;

export type MergeFn = (
  first: any,
  second: any,
  kind: MergeChangeKind,
  mc: MergeChangeFn,
) => unknown;

export type MergeMethods = Partial<Record<MergeMethodName, MergeFn>>;

export type NotMerged =
  | string
  | number
  | boolean
  | symbol
  | null
  | undefined
  | Array<any>
  | Date
  | Map<any, any>
  | Set<any>
  | RegExp
  | WeakSet<any>
  | WeakMap<any, any>
  | Promise<any>
  | Error
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array
  | ArrayBuffer;

export type Merged<T, U> = U extends undefined
  ? T
  : U extends NotMerged
    ? U
    : T extends NotMerged
      ? U
      : {
          [K in Exclude<keyof T, Operations>]: K extends keyof T & keyof Required<U>
            ? Merged<T[K], Required<U>[K]>
            : K extends keyof T
              ? T[K]
              : K extends keyof Required<U>
                ? Required<U>[K]
                : never;
        };

export type MergedAll<T extends any[]> = T extends [infer First, infer Second, ...infer Rest]
  ? Rest extends any[]
    ? MergedAll<[Merged<First, Second>, ...Rest]>
    : Merged<First, Second>
  : T extends [infer Only]
    ? Only
    : never;

export type MergeChangeFn = <T extends any[]>(...values: T) => MergedAll<T>;

export type PartialDeep<T> = T extends (infer U)[]
  ? PartialDeep<U>[]
  : T extends { [key: string | number | symbol]: unknown }
    ? { [K in keyof T]?: PartialDeep<T[K]> }
    : Partial<T>;

export type PatchOperation<T> = {
  $set?: Partial<T | FlatObject<T>>;
  $unset?: ExtractPaths<T, '.'>[];
  $leave?: ExtractPaths<T, '.'>[];
  $pull?: Record<ExtractPaths<T, '.'>, unknown>;
  $push?: Record<ExtractPaths<T, '.'>, unknown>;
  $concat?: Record<ExtractPaths<T, '.'>, unknown>;
};

export type Patch<T> =
  | PartialDeep<T>
  | (T extends (infer U)[]
      ? Patch<U>[]
      : T extends { [key: string | number | symbol]: unknown }
        ? PatchOperation<T> & { [K in keyof T]?: Patch<T[K]> } // Для объектов: операции + рекурсивный патч
        : Partial<T>); // Для примитивов: сам тип
