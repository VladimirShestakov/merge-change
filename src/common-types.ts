export type PropertyName = string | number | symbol;

export type PropertyPath = string | number;

export type PropertyParts = Array<string | number>;

export interface ObjectValue {
  [key: PropertyName]: unknown;
}
