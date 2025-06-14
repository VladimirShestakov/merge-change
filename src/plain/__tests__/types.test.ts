import { Plain } from '../types';

// Test types
type Primitive = string;
type SimpleObject = { a: number; b: string };
type NestedObject = { a: number; b: { c: string; d: boolean } };
type ArrayType = string[];
type ObjectWithArray = { a: number; b: string[] };
type NestedArray = Array<{ a: number }>;

// Object with toJSON method
type WithToJSON = {
  value: number;
  toJSON(): { serialized: number };
};

// ==================== Plain<T> Tests for Primitives ====================
// Primitives should remain unchanged
type PlainPrimitive = Plain<Primitive>;
const primValue: PlainPrimitive = 'test'; // Should be string

// null and undefined should remain unchanged
type PlainNull = Plain<null>;
const nullValue: PlainNull = null;

type PlainUndefined = Plain<undefined>;
const undefinedValue: PlainUndefined = undefined;

// ==================== Plain<T> Tests for Objects ====================
// Simple objects should have their properties recursively processed
type PlainSimpleObject = Plain<SimpleObject>;
const simpleObj: PlainSimpleObject = { a: 1, b: 'test' };

// Nested objects should have all properties recursively processed
type PlainNestedObject = Plain<NestedObject>;
const nestedObj: PlainNestedObject = { a: 1, b: { c: 'test', d: true } };

// ==================== Plain<T> Tests for Arrays ====================
// Arrays should have their elements recursively processed
type PlainArray = Plain<ArrayType>;
const arrayValue: PlainArray = ['test1', 'test2'];

// Objects with arrays should have the arrays recursively processed
type PlainObjectWithArray = Plain<ObjectWithArray>;
const objWithArray: PlainObjectWithArray = { a: 1, b: ['test1', 'test2'] };

// Nested arrays should have their elements recursively processed
type PlainNestedArray = Plain<NestedArray>;
const nestedArray: PlainNestedArray = [{ a: 1 }, { a: 2 }];

// ==================== Plain<T> Tests for Objects with toJSON ====================
// Objects with toJSON method should be converted to the return type of toJSON
type PlainWithToJSON = Plain<WithToJSON>;
// The result should be the return type of toJSON
const toJSONResult: PlainWithToJSON = { serialized: 42 };

// This should not be valid as it doesn't match the return type of toJSON
// @ts-expect-error - This doesn't match the return type of toJSON
const invalidToJSONResult: PlainWithToJSON = { value: 42 };

// ==================== Plain<T> Tests for Complex Nested Structures ====================
// Complex nested structure with arrays, objects, and toJSON methods
type ComplexType = {
  a: number;
  b: {
    c: string;
    d: WithToJSON;
  };
  e: Array<{
    f: boolean;
    g: WithToJSON;
  }>;
};

type PlainComplexType = Plain<ComplexType>;
const complexValue: PlainComplexType = {
  a: 1,
  b: {
    c: 'test',
    d: { serialized: 42 },
  },
  e: [
    { f: true, g: { serialized: 43 } },
    { f: false, g: { serialized: 44 } },
  ],
};

// This should not be valid as it doesn't match the expected structure
const invalidComplexValue: PlainComplexType = {
  a: 1,
  b: {
    c: 'test',
    // @ts-expect-error - This doesn't match the return type of toJSON
    d: { value: 42 }, // This should be { serialized: 42 }
  },
  e: [
    { f: true, g: { serialized: 43 } },
    { f: false, g: { serialized: 44 } },
  ],
};
