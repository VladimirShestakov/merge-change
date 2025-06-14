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
  [Name in keyof Obj & string]:
    | Name
    | (NonNullable<Obj[Name]> extends ObjectValueDeep
        ? `${Name}${Sep}${ExtractPaths<NonNullable<Obj[Name]>, Sep>}`
        : NonNullable<Obj[Name]> extends Array<infer E>
          ?
              | `${Name}${Sep}${number}`
              | (E extends ObjectValueDeep
                  ? `${Name}${Sep}${number}${Sep}${ExtractPaths<E, Sep>}`
                  : never)
          : never);
}[keyof Obj & string];

export type ExtractPathsStarted<Obj, Sep extends string> = {
  [Name in keyof Obj & string]:
    | `${Sep}${Name}`
    | (NonNullable<Obj[Name]> extends ObjectValueDeep
        ? `${Sep}${Name}${Sep}${ExtractPaths<NonNullable<Obj[Name]>, Sep>}`
        : NonNullable<Obj[Name]> extends Array<infer E>
          ?
              | `${Sep}${Name}${Sep}${number}`
              | (E extends ObjectValueDeep
                  ? `${Sep}${Name}${Sep}${number}${Sep}${ExtractPaths<E, Sep>}`
                  : never)
          : never);
}[keyof Obj & string];

export type ExtractPathsAny<Obj, Sep extends string> =
  | ExtractPaths<Obj, Sep>
  | ExtractPathsStarted<Obj, Sep>;

/**
 * Extracts paths only to leaf properties of an object (array elements are not considered).
 * For example, ExtractPathsLeaf<{a: number, b: {c: string, d: {e: boolean}}, f: string[]}, '.'> => "a" | "b.c" | "b.d.e" | "f"
 */
export type ExtractPathsLeaf<Obj, Sep extends string> = {
  [Name in keyof Obj & string]: NonNullable<Obj[Name]> extends ObjectValueDeep
    ? NonNullable<Obj[Name]> extends Record<PropertyPath, never>
      ? Name // Empty object case
      : `${Name}${Sep}${ExtractPathsLeaf<NonNullable<Obj[Name]>, Sep>}`
    : Name; // Leaf property (including arrays)
}[keyof Obj & string];

/**
 * Extracts paths with asterisks for operations that clear all properties or elements.
 * For example, ExtractPathsAsterisk<{a: number, b: {c: string}, d: number[]}, '.'> => "a" | "a.*" | "b" | "b.*" | "b.c" | "b.c.*" | "d" | "d.*" | "d.0" | "*"
 * The asterisk can be used at the root level to clear all properties, or after a property name to clear all elements of an array or set a non-object, non-array property to undefined.
 */
export type ExtractPathsAsterisk<Obj, Sep extends string> =
  | {
      [Name in keyof Obj & string]:
        | Name
        | `${Name}${Sep}*` // Add asterisk path for each property
        | (NonNullable<Obj[Name]> extends ObjectValueDeep
            ? `${Name}${Sep}${ExtractPathsAsterisk<NonNullable<Obj[Name]>, Sep>}`
            : NonNullable<Obj[Name]> extends Array<infer E>
              ?
                  | `${Name}${Sep}${number}`
                  | (E extends ObjectValueDeep
                      ? `${Name}${Sep}${number}${Sep}${ExtractPathsAsterisk<E, Sep>}`
                      : never)
              : never);
    }[keyof Obj & string]
  | '*'; // Add root asterisk

/**
 * Extracts the value type for a specific path, including objects, arrays, and their elements
 * For example, `PathToType<{items: string[]}, 'items.0'>` => `string`
 * For example, `PathToType<{items: {prop: number}}, 'items.prop'>` => `number'
 * For example, `PathToType<{items: string[]}, ''>` => `{items: string[]}`
 */
export type PathToType<T, P extends string, Sep extends string> = P extends ''
  ? T // If the path is empty, return the original type
  : P extends keyof T
    ? T[P] // Return the value type (primitive, object, or array)
    : P extends `${Sep}${infer Rest}`
      ? PathToType<T, Rest, Sep> // If the path starts with a separator, remove it and continue
      : P extends `${infer Key}${Sep}${infer Rest}`
        ? Key extends keyof T
          ? T[Key] extends Array<infer E> | undefined
            ? Rest extends `${infer Index extends number}`
              ? E
              : Rest extends `${infer Index extends number}${Sep}${infer SubPath}`
                ? E extends ObjectValueDeep
                  ? PathToType<E, SubPath, Sep>
                  : undefined
                : undefined
            : T[Key] extends ObjectValueDeep | undefined
              ? PathToType<NonNullable<T[Key]>, Rest, Sep>
              : undefined
          : undefined
        : undefined;
