import { HasMethod } from './types';

/**
 * Checking for the presence of a method by its name with confirmation for TypeScript
 * @param value Object to check
 * @param method Method name
 */
export function hasMethod<M extends string | number | symbol>(
  value: HasMethod<M> | unknown,
  method: M,
): value is HasMethod<M> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      method in value &&
      typeof (value as any)[method] === 'function',
  );
}
