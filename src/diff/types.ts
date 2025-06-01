import { ObjectValue, PropertyPath } from '../common-types/types';

export type DiffResult = {
  $unset: PropertyPath[];
  $set: ObjectValue;
};

export type DiffOptions = {
  ignore?: string[];
  white?: string[];
  path?: string;
  equal?: (a: unknown, b: unknown) => boolean;
  separator?: string;
};
