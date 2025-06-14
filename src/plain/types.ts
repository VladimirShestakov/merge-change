export type Plain<T> = T extends { toJSON: () => infer R }
  ? R
  : T extends Array<infer U>
    ? Array<Plain<U>>
    : T extends object
      ? { [K in keyof T]: Plain<T[K]> }
      : T;
