import { ExtractPathsLeaf, PathToType } from '../common-types/types';

/**
 * Creates a type representing a flattened object where all nested properties are at the top level.
 * Property names are dot-notation paths to the original nested properties.
 * For example, PlainObject<{a: {b: number}}> => {a: {b: number}, "a.b": number}
 */
export type FlatObject<T, Sep extends string = '.', Prefix extends string = ''> = {
  [K in ExtractPathsLeaf<T, Sep> & string as `${Prefix}${K}`]: PathToType<T, K, Sep>;
};
