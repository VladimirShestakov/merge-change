import { Type } from './types';

const toLowerCase = new Set(['Number', 'String', 'Boolean', 'Object', 'Symbol']);

/**
 * Тип значения - название конструктора
 * @param value
 */
export function type(value: unknown): Type {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'undefined') {
    return 'undefined';
  }
  if (typeof value === 'object' && !('__proto__' in value)) {
    return 'object';
  }

  const name = Object.getPrototypeOf(value).constructor.name;

  return toLowerCase.has(name) ? name.toLowerCase() : name;
}

export function isPlainObject(value: unknown): value is Record<string | number | symbol, unknown> {
  return type(value) === 'object';
}

export function isArray(value: unknown): value is unknown[] {
  return type(value) === 'Array';
}

/**
 * Все типы экземпляра по цепочке их наследования
 * @param value
 */
export function typeChain(value: unknown): Array<Type> {
  const result: Array<Type> = [];
  if (value === null) {
    result.push('null');
  } else if (typeof value === 'undefined') {
    result.push('undefined');
  } else {
    const getClass = (value: any): void => {
      if (value && value.constructor) {
        const name = value.constructor.name;
        result.push(toLowerCase.has(name) ? name.toLowerCase() : name);
        getClass(Object.getPrototypeOf(value));
      }
    };
    getClass(Object.getPrototypeOf(value));
  }
  return result;
}

/**
 * Проверка принадлежности к классу (конструктору) по строковому названию класса (конструктора)
 * @param value Значение для проверки
 * @param className Название класса (конструктора)
 */
export function isInstanceof<Type = unknown>(value: unknown, className: string): value is Type {
  if (value === null) {
    return className === 'null';
  } else {
    const hasClass = (value: any): boolean => {
      if (value && value.constructor) {
        const name = value.constructor.name;
        const lowerCaseName = toLowerCase.has(name) ? name.toLowerCase() : name;
        if (className === lowerCaseName) {
          return true;
        }
        return hasClass(Object.getPrototypeOf(value));
      } else {
        return false;
      }
    };
    return hasClass(Object.getPrototypeOf(value));
  }
}
