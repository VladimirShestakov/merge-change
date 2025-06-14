import { get } from '../get';
import { flat } from '../flat';

/**
 * Checking properties in an object. Nested properties are specified using a path to them through separator
 * @param value Object to check, which should contain condition properties
 * @param condition Target object, all properties of which should be in value
 * @param data Data for substitution in the condition template. For example, '$session.user.name' in condition will be substituted with the value from data.session.user.name
 * @param separator Separator for templated value
 * @param errors If an array is passed, the names of properties that don't match will be added to it
 * @returns Whether the value matches the condition
 */
export function match(
  value: unknown,
  condition: unknown = {},
  data: Record<string, unknown> = {},
  separator: string = '.',
  errors?: string[],
): boolean {
  let result = true;
  const flatValue = flat(value, separator) as Record<string, unknown>;

  if (typeof condition !== 'object' || condition === null) {
    return condition === flatValue;
  }

  const conditionObj = condition as Record<string, unknown>;
  const keys = Object.keys(conditionObj);

  for (const key of keys) {
    const conditionValue = conditionObj[key];
    const valueAtKey = key in flatValue ? flatValue[key] : undefined;

    if (conditionValue !== valueAtKey) {
      // templated value
      if (typeof conditionValue === 'string' && conditionValue.startsWith('$')) {
        const realCondition = get(data, conditionValue.substring(1), undefined, separator);
        if (realCondition === valueAtKey && key in flatValue) {
          break;
        }
      }

      let arrayEq = false;
      if (
        Array.isArray(conditionValue) &&
        Array.isArray(valueAtKey) &&
        conditionValue.length === valueAtKey.length
      ) {
        arrayEq = true; // possibly match
        for (let i = 0; i < conditionValue.length; i++) {
          if (!match(valueAtKey[i], conditionValue[i], data, separator)) {
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
