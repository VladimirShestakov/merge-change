import { ExtractPathsAny, PathToType } from '../common-types/types';

/**
 * Retrieves the value at the specified path in a deeply nested data structure. If the path does not exist,
 * the function returns the provided default value.
 *
 * @param data - The data object or array from which to retrieve the value.
 * @param path - The path string to the desired value, with parts separated by the specified separator.
 * @param [defaultValue=undefined] - The value to return if the path does not exist.
 * @param [separator='.'] - The string used to separate path segments. Defaults to '.'.
 * @return The value at the specified path in the data structure or the default value if the path is invalid.
 */
export function get<D, P extends ExtractPathsAny<D, S>, S extends string = '.'>(
  data: D,
  path: P,
  defaultValue: unknown = undefined,
  separator: S = '.' as S,
): PathToType<D, P, S> {
  const parts = path.split(separator);
  // If the path starts with a separator, the first element will be an empty string, remove it
  if (parts[0] === '') {
    parts.shift();
  }
  let current: unknown = data;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else if (Array.isArray(current) && /^\d+$/.test(part)) {
      const index = parseInt(part, 10);
      if (index < current.length) {
        current = current[index];
      } else {
        return defaultValue as PathToType<D, P, S>;
      }
    } else {
      return defaultValue as PathToType<D, P, S>;
    }
  }

  return current as PathToType<D, P, S>;
}
