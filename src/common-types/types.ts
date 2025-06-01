export type PropertyPath = string | number;

export type PropertyParts = Array<PropertyPath>;

export interface ObjectValue {
  [key: PropertyPath]: unknown;
}

export interface ObjectValueDeep {
  [key: PropertyPath]: unknown | ObjectValueDeep;
}

/**
 * Extracts all possible paths in an object, including array indices
 * For example, ExtractPaths<{items: string[], x: {y: number}}, '.'> => "items" | "items.0" | "items.1" | ... | "x" | "x.y"
 * For example, ExtractPaths<{items: string[], x: {y: number}}, '/'> => "items" | "items/0" | "items/1" | ... | "x" | "x/y"
 */
export type ExtractPaths<Obj, Sep extends string> = {
  [Name in keyof Obj & string]: Obj[Name] extends ObjectValueDeep
    ? Name | `${Name}${Sep}${ExtractPaths<Obj[Name], Sep>}`
    : Obj[Name] extends Array<infer E>
      ?
          | Name
          | `${Name}${Sep}${number}`
          | (E extends ObjectValueDeep
              ? `${Name}${Sep}${number}${Sep}${ExtractPaths<E, Sep>}`
              : never)
      : Name;
}[keyof Obj & string];

export type ExtractPathsStarted<Obj, Sep extends string> = {
  [Name in keyof Obj & string]: Obj[Name] extends ObjectValueDeep
    ? `${Sep}${Name}` | `${Sep}${Name}${Sep}${ExtractPaths<Obj[Name], Sep>}`
    : Obj[Name] extends Array<infer E>
      ?
          | `${Sep}${Name}`
          | `${Sep}${Name}${Sep}${number}`
          | (E extends ObjectValueDeep
              ? `${Sep}${Name}${Sep}${number}${Sep}${ExtractPaths<E, Sep>}`
              : never)
      : `${Sep}${Name}`;
}[keyof Obj & string];

export type ExtractPathsAny<Obj, Sep extends string> =
  | ExtractPaths<Obj, Sep>
  | ExtractPathsStarted<Obj, Sep>;

/**
 * Extracts paths only to leaf properties of an object (array elements are not considered).
 * For example, ExtractPathsLeaf<{a: number, b: {c: string, d: {e: boolean}}, f: string[]}, '.'> => "a" | "b.c" | "b.d.e" | "f"
 */
export type ExtractPathsLeaf<Obj, Sep extends string> = {
  [Name in keyof Obj & string]: Obj[Name] extends ObjectValueDeep
    ? Obj[Name] extends Record<PropertyPath, never>
      ? Name // Empty object case
      : `${Name}${Sep}${ExtractPathsLeaf<Obj[Name], Sep>}`
    : Name; // Leaf property (including arrays)
}[keyof Obj & string];

/**
 * Extracts the value type for a specific path, including objects, arrays, and their elements
 * For example, `PathToType<{items: string[]}, 'items.0'>` => `string`
 * For example, `PathToType<{items: {prop: number}}, 'items.prop'>` => `number'
 */
export type PathToType<T, P extends string, Sep extends string> = P extends keyof T
  ? T[P] // Return the value type (primitive, object, or array)
  : P extends `${Sep}${infer Rest}`
    ? PathToType<T, Rest, Sep> // If the path starts with a separator, remove it and continue
    : P extends `${infer Key}${Sep}${infer Rest}`
      ? Key extends keyof T
        ? T[Key] extends ObjectValueDeep
          ? PathToType<T[Key], Rest, Sep>
          : T[Key] extends Array<infer E>
            ? Rest extends `${infer Index extends number}`
              ? E
              : Rest extends `${infer Index extends number}${Sep}${infer SubPath}`
                ? E extends ObjectValueDeep
                  ? PathToType<E, SubPath, Sep>
                  : never
                : never
            : never
        : never
      : never;
