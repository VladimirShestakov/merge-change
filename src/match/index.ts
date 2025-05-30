import { plain } from '../plain';
import { get } from '../get';
import { flat } from '../flat';

/**
 * Проверка свойств в объекте. Вложенные свойства указываются с помощью пути на них через separator
 * @param value {Object} Проверяемый объект, который должен содержать свойства condition
 * @param condition {Object} Искомый объект, все свойства которые должны быть в value
 * @param [data] {Object} Данные для подстановки в шаблон условия. Например '$session.user.name' в condition будет подставлено значением из data.session.user.name
 * @param [errors] {Array} Если передать массив, то в него добавятся названия свойств, по которым нет совпадений
 * @returns {boolean}
 */
export function match(
  value: any,
  condition: any = {},
  data: any = {},
  errors: any = undefined,
): boolean {
  let result = true;
  const flatValue = plain(flat(value, ''));
  if (typeof condition !== 'object') {
    return condition === flatValue;
  }
  const keys = Object.keys(condition);
  for (const key of keys) {
    if (condition[key] !== flatValue[key]) {
      if (typeof condition[key] === 'string' && condition[key].substr(0, 1) === '$') {
        const realCondition = get(data, condition[key].substr(1), undefined);
        if (realCondition === flatValue[key] && key in flatValue) {
          break;
        }
      }
      let arrayEq = false;
      if (
        Array.isArray(condition[key]) &&
        Array.isArray(flatValue[key]) &&
        condition[key].length === flatValue[key].length
      ) {
        arrayEq = true; // возможно совпадают
        for (let i = 0; i < condition[key].length; i++) {
          if (!match(flatValue[key][i], condition[key][i], data)) {
            arrayEq = false;
            break;
          }
        }
      }
      if (!arrayEq) {
        if (errors) errors.push(key);
        result = false;
      }
    }
  }
  return result;
}
