export type HasMethod<M extends string | number | symbol> = {
  [name in M]: (...args: unknown[]) => unknown;
};
