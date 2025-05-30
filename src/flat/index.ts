import { type } from '../type';

/**
 * Конвертация вложенной структуры в плоскую
 * Названия свойств превращаются в путь {a: {b: 0}} => {'a.b': 0}
 * @param value {object|*} Исходный объекты для конвертации
 * @param [path] {string} Базовый путь для формирования ключей плоского объекта. Используется для рекурсии.
 * @param [clearUndefined] {boolean} Признак, добавлять ли в результат неопределенные значения
 * @param [result] {object} Результат - плоский объект. Передаётся по ссылки для рекурсии
 * @returns {{}}
 */
export function flat(value: any, path: string = '', clearUndefined = false, result: any = {}) {
  if (value && typeof value.toJSON === 'function') {
    value = value.toJSON();
  } else {
    //value = value.valueOf();
  }
  if (type(value) === 'object') {
    for (const [key, item] of Object.entries(value)) {
      flat(item, path ? `${path}.${key}` : key, clearUndefined, result);
    }
  } else if (!clearUndefined || typeof value !== 'undefined') {
    if (path === '') {
      result = value;
    } else {
      result[path] = value;
    }
  }
  return result;
}
