import { Patch } from '../types';
import { merge } from '../index';

type TestObject = {
  x: number;
  inner: {
    y: number;
    list: number[];
    sub: {
      title: string;
    };
  };
};

type TestPatch = Patch<TestObject>;

const value: TestObject = {
  x: 1,
  inner: {
    y: 2,
    list: [3, 4],
    sub: {
      title: 'name',
    },
  },
};

const patch: TestPatch = {
  inner: {
    $set: {
      y: 20,
    },
  },
  $set: {
    'inner.y': 3,
  },
};

const patch2: TestPatch = {};

const partial: Partial<TestPatch> = {
  inner: {
    y: 500,
  },
};

const result1: TestObject = merge(value, value);

const result2: TestObject = merge(value, patch);

const result3: TestObject = merge(value, partial);

const result4: TestObject = merge(value, { z: 10 });

const result5: TestObject = merge(value, { $set: { inner: { y: 20 } } });

// @ts-expect-error - 'string' is not a valid type for x
const result6: TestObject = merge(value, { x: 'string' });

interface Env {
  [key: string]: any;

  PROD: boolean;
  DEV: boolean;
}

const envPatch: Patch<Env> = {};
