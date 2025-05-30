import { type } from '../type';

function isEqual(first: any, second: any): boolean {
  return first === second;
}

/**
 * Вычисление разницы, результатом является объект с операторами $set и $unset
 * @param source {*} Исходное значение
 * @param compare {*} Сравниваемое (новое) значение
 * @param [ignore] {Array<string>} Названия игнорируемых свойств
 * @param [white] {Array<string>} Названия сравниваемых свойств, если массив не пустой
 * @param [path] {String} Путь на текущее свойство в рекурсивной обработке
 * @param [equal] {Function} Функция сравнения значений
 * @param [result] {String} Возвращаемый результат в рекурсивной обработке. Не следует использовать.
 * @returns {{$unset: [], $set: {}}}
 */
export function diff(
  source: any,
  compare: any,
  { ignore = [], white = [], path = '', equal = isEqual }: any,
  result: any = undefined,
): { $unset: []; $set: {} } {
  if (!result) {
    result = { $set: {}, $unset: [] };
  }
  // Это не JSON.stringify! Вызываем метод, который даёт значение на конвертацию в JSON, но конвертация не выполняется
  // Типы свойств остаются исходными, но при этом можем сравнить внутренности кастомных объектов
  const sourcePlain = source && typeof source.toJSON === 'function' ? source.toJSON() : source;
  const comparePlain = compare && typeof compare.toJSON === 'function' ? compare.toJSON() : compare;

  const sourceType = type(sourcePlain);
  const compareType = type(comparePlain);
  if (sourceType === compareType && sourceType === 'object') {
    const sourceKeys = Object.keys(sourcePlain);
    const compareKeys = Object.keys(comparePlain);
    // set property
    for (const key of compareKeys) {
      const p = path ? path + '.' + key : key;
      // Если свойство не в игноре и если определен белый список, то оно есть в нём
      if (!ignore.includes(p) && (white.length === 0 || white.includes(p))) {
        // new property
        if (!(key in sourcePlain)) {
          result.$set[p] = comparePlain[key];
        } else if (!equal(comparePlain[key], sourcePlain[key])) {
          // change property
          diff(
            sourcePlain[key],
            comparePlain[key],
            {
              ignore,
              white,
              path: p,
              equal,
            },
            result,
          );
        }
      }
    }
    // unset property
    for (const key of sourceKeys) {
      if (!(key in comparePlain)) {
        const p = path ? path + '.' + key : key;
        if (!ignore.includes(p) && (white.length === 0 || white.includes(p))) {
          result.$unset.push(p);
        }
      }
    }
  } else {
    if (!path) {
      result = compare;
    } else {
      if (!ignore.includes(path) && (white.length === 0 || white.includes(path))) {
        result.$set[path] = compare;
      }
    }
  }
  return result;
}
