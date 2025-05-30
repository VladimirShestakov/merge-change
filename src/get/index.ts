import { ExtractPaths, PathToType, Separator, Value } from './types';

export function get<D, P extends ExtractPaths<D, S>, S extends Separator>(
  data: D,
  path: P,
  defaultValue: unknown = undefined,
  separator: S = '.' as S,
): PathToType<D, P, S> {
  const parts = path.split(separator);
  let current: unknown = data;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else if (Array.isArray(current) && /^\d+$/.test(part)) {
      const index = parseInt(part, 10);
      if (index < current.length) {
        current = current[index];
      } else {
        return defaultValue as PathToType<D, P, S>;
      }
    } else {
      return defaultValue as PathToType<D, P, S>;
    }
  }

  return current as PathToType<D, P, S>;
}
