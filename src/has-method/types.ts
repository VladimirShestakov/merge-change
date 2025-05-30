export type HasMethod<M extends string | number | symbol> = {
  [name in M]: (...args: any[]) => unknown;
};
