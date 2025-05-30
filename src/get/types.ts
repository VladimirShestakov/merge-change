export interface Value {
  [key: string]: unknown | Value;
}

/**
 * Извлекает все возможные пути в объекте, включая индексы массивов
 * Например, ExtractPaths<{items: string[], x: {y: number}}, '.'> => "items" | "items.0" | "items.1" | ... | "x" | "x.y" | ".x" | ".x.y"
 * Например, ExtractPaths<{items: string[], x: {y: number}}, '/'> => "items" | "items/0" | "items/1" | ... | "x" | "x/y" | "/x" | "/x/y"
 */
export type ExtractPaths<Obj, Sep extends string> =
  | {
      [Name in keyof Obj & string]: Obj[Name] extends Value
        ? Name | `${Name}${Sep}${ExtractPaths<Obj[Name], Sep>}`
        : Obj[Name] extends Array<infer E>
          ?
              | Name
              | `${Name}${Sep}${number}`
              | (E extends Value ? `${Name}${Sep}${number}${Sep}${ExtractPaths<E, Sep>}` : never)
          : Name;
    }[keyof Obj & string]
  | {
      [Name in keyof Obj & string]: Obj[Name] extends Value
        ? `${Sep}${Name}` | `${Sep}${Name}${Sep}${ExtractPaths<Obj[Name], Sep>}`
        : Obj[Name] extends Array<infer E>
          ?
              | `${Sep}${Name}`
              | `${Sep}${Name}${Sep}${number}`
              | (E extends Value
                  ? `${Sep}${Name}${Sep}${number}${Sep}${ExtractPaths<E, Sep>}`
                  : never)
          : `${Sep}${Name}`;
    }[keyof Obj & string];

/**
 * Извлекает тип значения по конкретному пути, включая объекты, массивы и их элементы
 * Например, `PathToType<{items: string[]}, 'items.0'>` => `string`
 * Например, `PathToType<{items: {prop: number}}, 'items.prop'>` => `number'
 */
export type PathToType<T, P extends string, Sep extends string> = P extends keyof T
  ? T[P] // Возвращаем тип значения (примитив, объект или массив)
  : P extends `${Sep}${infer Rest}`
    ? PathToType<T, Rest, Sep> // Если путь начинается с разделителя, удаляем его и продолжаем
    : P extends `${infer Key}${Sep}${infer Rest}`
      ? Key extends keyof T
        ? T[Key] extends Value
          ? PathToType<T[Key], Rest, Sep>
          : T[Key] extends Array<infer E>
            ? Rest extends `${infer Index extends number}`
              ? E
              : Rest extends `${infer Index extends number}${Sep}${infer SubPath}`
                ? E extends Value
                  ? PathToType<E, SubPath, Sep>
                  : never
                : never
            : never
        : never
      : never;
