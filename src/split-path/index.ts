/**
 * Раздение пути на элементы массива с игнором (обрезкой) разделителя вначале и конце строки
 * @param path {string} Путь для разделения
 * @param separator {string} Разделитель, например слэш
 * @returns {(number|string)[]}
 */
export function splitPath(path: string, separator = '.'): Array<string | number> {
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
