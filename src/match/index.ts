import { plain } from '../plain';
import { get } from '../get';
import { flat } from '../flat';

/**
 * Checking properties in an object. Nested properties are specified using a path to them through separator
 * @param value {Object} Object to check, which should contain condition properties
 * @param condition {Object} Target object, all properties of which should be in value
 * @param [data] {Object} Data for substitution in the condition template. For example, '$session.user.name' in condition will be substituted with the value from data.session.user.name
 * @param [separator='.'] Separator for templated value
 * @param [errors] {Array} If an array is passed, the names of properties that don't match will be added to it
 * @returns {boolean}
 */
export function match(
  value: any,
  condition: any = {},
  data: any = {},
  separator: string = '.',
  errors: any = undefined,
): boolean {
  let result = true;
  const flatValue = plain(flat(value, separator));
  if (typeof condition !== 'object') {
    return condition === flatValue;
  }
  const keys = Object.keys(condition);
  for (const key of keys) {
    if (condition[key] !== flatValue[key]) {
      // templated value
      if (typeof condition[key] === 'string' && condition[key].substr(0, 1) === '$') {
        const realCondition = get(data, condition[key].substr(1), undefined, separator);
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
        arrayEq = true; // possibly match
        for (let i = 0; i < condition[key].length; i++) {
          if (!match(flatValue[key][i], condition[key][i], data, separator)) {
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
