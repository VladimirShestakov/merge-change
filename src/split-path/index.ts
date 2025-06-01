/**
 * Splits a path into array elements, ignoring (trimming) the separator at the beginning and end of the string
 * @param path {string} Path to split
 * @param separator {string} Separator, for example, a point
 * @returns {(number|string)[]}
 */
export function splitPath(path: string, separator: string = '.'): Array<string | number> {
  if (path.substring(0, separator.length) === separator) {
    path = path.substring(separator.length);
  }
  if (path.substring(path.length - separator.length) === separator) {
    path = path.substring(0, path.length - separator.length);
  }
  return path.split(separator).map((name) => {
    const index = Number(name);
    return !Number.isNaN(index) && index !== null ? index : name;
  });
}
