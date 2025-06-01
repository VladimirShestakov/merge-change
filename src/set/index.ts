import { splitPath } from '../split-path';

/**
 * Sets a value at the specified path. If the path is not found in obj, the corresponding property will be created
 * @param obj - Object in which the value is set
 * @param path - Path in the object where the value is set
 * @param value - Value to be set
 * @param skipExisting - If true, do not replace existing values (set only if absent)
 * @returns Previous value at the specified path
 */
export function set(obj: any, path: any, value: any, skipExisting: boolean = false): any {
  if (obj && typeof obj.toJSON === 'function') {
    obj = obj.toJSON();
  }
  if (typeof path === 'number') {
    path = [path];
  }
  if (!path || !path.length) {
    return obj;
  }
  if (!Array.isArray(path)) {
    return set(obj, splitPath(path), value, skipExisting);
  }
  const currentPath = path[0];
  const currentValue = obj[currentPath];
  if (path.length === 1) {
    // If it's the last element of the path, set the value
    if (!skipExisting || currentValue === void 0) {
      obj[currentPath] = value;
    }
    return currentValue;
  }
  // If the path continues but the current element doesn't exist, an empty object is created
  if (currentValue === void 0) {
    obj[currentPath] = {};
  }
  return set(obj[currentPath], path.slice(1), value, skipExisting);
}
