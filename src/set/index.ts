import { splitPath } from '../split-path';

/**
 * Установка значения по пути. Если в obj путь не найден, то будут созданы соотв свойство
 * @param obj - Объект, в который устанавливается значение
 * @param path - Путь в объекте, по которому устанавливается значение
 * @param value - Устанавливаемое значение
 * @param skipExisting - Если true, не заменять существующие значения (установка только при отсутствии)
 * @returns Предыдущее значение по указанному пути
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
    // Если последний элемент пути, то установка значения
    if (!skipExisting || currentValue === void 0) {
      obj[currentPath] = value;
    }
    return currentValue;
  }
  // Если путь продолжается, а текущего элемента нет, то создаётся пустой объект
  if (currentValue === void 0) {
    obj[currentPath] = {};
  }
  return set(obj[currentPath], path.slice(1), value, skipExisting);
}
