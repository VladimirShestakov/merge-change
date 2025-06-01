import { FlatObject } from '../types';

// Test object
type TestObject = {
  a: number;
  b: {
    c: string;
    d: {
      e: boolean;
    };
  };
  f: string[];
};

// Test FlatObject
type FlatTestObject1 = FlatObject<TestObject, '.'>;

// These should all be valid property accesses
const test1: FlatTestObject1 = {
  a: 1,
  'b.c': 'test',
  'b.d.e': true,
  f: ['test'],
};

// This should show the expected type
const propertyA1: number = test1['a'];
const propertyBC1: string = test1['b.c'];
const propertyBDE1: boolean = test1['b.d.e'];

// Test FlatObject with two slash
type FlatTestObject2 = FlatObject<TestObject, '//'>;

// These should all be valid property accesses
const test2: FlatTestObject2 = {
  a: 1,
  'b//c': 'test',
  'b//d//e': true,
  f: ['test'],
};

// This should show the expected type
const propertyA2: number = test2['a'];
const propertyBC2: string = test2['b//c'];
const propertyBDE2: boolean = test2['b//d//e'];

// Test FlatObject with a path prefix
type FlatTestObject3 = FlatObject<TestObject, '.', 'prefix:'>;

// These should all be valid property accesses
const test3: FlatTestObject3 = {
  'prefix:a': 1,
  'prefix:b.c': 'test',
  'prefix:b.d.e': true,
  'prefix:f': ['test'],
};

// This should show the expected type
const propertyA3: number = test3['prefix:a'];
const propertyBC3: string = test3['prefix:b.c'];
const propertyBDE3: boolean = test3['prefix:b.d.e'];
