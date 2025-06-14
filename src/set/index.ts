import { splitPath } from '../split-path';
import { hasMethod } from '../has-method';
import { ExtractPathsAny, PathToType, PropertyPath } from '../common-types/types';

/**
 * Sets a value at the specified path. If the path is not found in obj, the corresponding property will be created
 * @param obj - Object in which the value is set
 * @param path - Path in the object where the value is set
 * @param value - Value to be set
 * @param skipExisting - If true, do not replace existing values (set only if absent)
 * @param separator - Separator in a property path
 * @returns Previous value at the specified path
 */
export function set<D, P extends ExtractPathsAny<D, S>, S extends string = '.'>(
  obj: D,
  path: P,
  value: unknown,
  skipExisting: boolean = false,
  separator: S = '.' as S,
): PathToType<D, P, S> {
  const parts = splitPath(path, separator);

  if (parts.length === 0) return obj as PathToType<D, P, S>;

  let current = obj as Record<PropertyPath, unknown>;

  // Traverse the object using parts until the last part
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];

    if (current[part] === undefined || current[part] === null) {
      // Create an object or array based on the next part
      const nextPart = parts[i + 1];
      current[part] = typeof nextPart === 'number' ? [] : {};
    }

    const nextValue = current[part];
    current = (hasMethod(nextValue, 'toJSON') ? nextValue.toJSON() : nextValue) as Record<
      PropertyPath,
      unknown
    >;
  }

  // Update the final property
  const lastPart = parts[parts.length - 1];
  const currentValue = current[lastPart];

  // If it's the last element of the path, set the value
  if (!skipExisting || currentValue === void 0) {
    current[lastPart] = value;
  }

  return currentValue as PathToType<D, P, S>;
}
