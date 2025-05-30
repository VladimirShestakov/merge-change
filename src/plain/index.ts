import { type } from '../type';

/**
 * Конвертирует структуру данных через рекурсивный вызов методов toPlain или toJSON если они есть у каждого значения.
 * Если метода нет, возвращается исходное значение.
 * Значения для которых нет метода call останутся в исходном значении.
 * @param value {*} Значение для конвертации
 * @param [recursive] {Boolean} Выполнить вложенную обработку
 * @returns {*}
 */
export function plain(value: any, recursive = true): any {
  if (value === null || typeof value === 'undefined') {
    return value;
  } else if (typeof value.toJSON === 'function') {
    value = value.toJSON();
  } else {
    //value = value.valueOf();
  }
  if (recursive) {
    if (Array.isArray(value)) {
      return value.map((item) => plain(item));
    } else if (type(value) === 'object') {
      const result: any = {};
      for (const [key, item] of Object.entries(value)) {
        result[key] = plain(item);
      }
      return result;
    }
  }
  return value;
}
