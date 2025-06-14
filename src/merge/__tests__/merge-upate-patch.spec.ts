import mc from '../index';
import { Patch } from '../types';

describe('Test merge()', () => {
  test('mergeStringNumber', () => {
    expect(mc.merge('string', 1234)).toBe(1234);
  });

  test('mergeStringUndefined', () => {
    expect(mc.merge('string', undefined)).toBe('string');
  });

  test('mergeUndefinedString', () => {
    expect(mc.merge(undefined, 'string')).toBe('string');
  });

  test('mergeUndefinedDate', () => {
    const second = new Date();
    const result = mc.merge(undefined, second);
    expect(result).not.toBe(second);
    expect(result).toEqual(new Date(second));
  });

  test('mergeUndefinedSet', () => {
    const second = new Set([1, 2, 3]);
    const result = mc.merge(undefined, second);
    expect(result).not.toBe(second);
    expect(result).toEqual(new Set(second));
  });

  test('mergeUndefinedMap', () => {
    const second = new Map([
      ['1', 1],
      ['2', 2],
      ['3', 3],
    ]);
    const result = mc.merge(undefined, second);
    expect(result).not.toBe(second);
    expect(result).toEqual(new Map(second));
  });

  test('mergeUndefinedArray', () => {
    const second = [1, 2, 3];
    const result = mc.merge(undefined, second);
    expect(result).not.toBe(second);
    expect(result).toEqual(second);
  });

  test('mergeUndefinedObject', () => {
    const second = { prop1: 'value1', prop2: 'value2' };
    const result = mc.merge(undefined, second);
    expect(result).not.toBe(second);
    expect(result).toEqual(second);
  });

  test('mergeArrayArray', () => {
    const first = [1, 2, 3];
    const second = [5, 6, 7, 8];
    const result = mc.merge(first, second);
    expect(result).not.toBe(second);
    expect(result).not.toEqual([...first, ...second]);
    expect(result).toEqual(second);
  });

  test('mergeObjectObject', () => {
    const first = { prop1: 'value1', prop2: 'value2', x: { z: '3' } };
    const second = { prop2: 'value222', prop3: 'value3' };
    const result = mc.merge(first, second);
    expect(result).toEqual({ prop1: 'value1', prop2: 'value222', x: { z: '3' }, prop3: 'value3' });
  });

  test('mergeObjectObjectTyped', () => {
    type My = {
      x: string;
      y: number;
      sub: {
        value: number;
      };
    };
    const first: My = { x: 'value1', y: 1, sub: { value: 5 } };
    const second = { x: 'ffffffff' };
    const result: My = mc.merge(first, second);
    expect(result).toEqual({ x: 'ffffffff', y: 1, sub: { value: 5 } });
  });

  test('mergeObjectObject many', () => {
    const first = { prop1: 'value1', prop2: 'value2' };
    const second = { prop2: 'value222', prop3: 'value3' };
    const third = { prop6: 7 };
    const fourth = { prop8: /.*/ };
    const result = mc.merge(first, second, third, fourth);
    expect(result).toEqual({
      prop1: 'value1',
      prop2: 'value222',
      prop3: 'value3',
      prop6: 7,
      prop8: /.*/,
    });
  });

  test('merge', () => {
    type TestObject = {
      field1: {
        a1?: number;
        a2?: number;
        a3?: number;
      };
      field2?: {
        b1?: number;
        b2?: number;
      };
    };
    const first: TestObject = {
      field1: {
        a1: 10,
        a2: 11,
        a3: 12,
      },
    };
    const second: Patch<TestObject> = {
      field2: {
        b2: 20,
      },
      $unset: ['field1.a1'],
      field1: {
        $unset: ['a2'],
      },
    };

    const result = mc.merge(first, second);
    expect(result === first).toEqual(false);
    expect(result.field1).not.toBe(first.field1);
    expect(result.field1).not.toBe(second.$unset);
    expect(result.field2).not.toBe(second.field2);
    expect(result).toEqual({
      field1: {
        a3: 12,
      },
      field2: {
        b2: 20,
      },
    });
  });

  test('patch', () => {
    type TestObject = {
      field1: {
        a1?: number;
        a2?: number;
        a3?: number;
      };
      field2?: {
        b1?: number;
        b2?: number;
      };
    };
    const first: TestObject = {
      field1: {
        a1: 10,
        a2: 11,
        a3: 12,
      },
    };
    const second: Patch<TestObject> = {
      field2: {
        b2: 20,
      },
      $unset: ['field1.a1'],
      field1: {
        $unset: ['a2'],
      },
    };
    const result = mc.patch(first, second);
    expect(result === first).toEqual(true);
    expect(result.field1 === first.field1).toEqual(true);
    expect(result.field1 === second.field1).toEqual(false);
    expect(result.field2 === second.field2).toEqual(true);
    expect(result).toEqual({
      field1: {
        a3: 12,
      },
      field2: {
        b2: 20,
      },
    });
  });

  test('patch 2', () => {
    const first = {
      field: {
        sub1: {
          value: 10,
        },
        sub2: {
          deepSub: {
            value: 20,
          },
        },
      },
    };
    const second = {
      field: {
        sub2: {
          deepSub: {
            second: 30,
          },
        },
      },
    };
    const result = mc.patch(first, second);
    expect(result === first).toEqual(true);
    expect(result.field === first.field).toEqual(true);
    expect(result.field.sub2 === first.field.sub2).toEqual(true);
    expect(result.field.sub2.deepSub === first.field.sub2.deepSub).toEqual(true);
    expect(result).toStrictEqual({
      field: {
        sub1: { value: 10 },
        sub2: {
          deepSub: {
            value: 20,
            second: 30,
          },
        },
      },
    });
  });

  test('update', () => {
    type TestObject = {
      field1: {
        a1: number;
        a2: number;
        a3: { value: number };
      };
      field2?: {
        b1?: number;
        b2?: number;
      };
    };
    const first: TestObject = {
      field1: {
        a1: 10,
        a2: 11,
        a3: {
          value: 12,
        },
      },
    };
    const second: Patch<TestObject> = {
      field2: {
        b2: 20,
      },
      $unset: ['field1.a1'],
      field1: {
        $unset: ['a2'],
      },
    };
    const result = mc.update(first, second);
    expect(result === first).toEqual(false);
    expect(result.field1 === first.field1).toEqual(false);
    expect(result.field1.a3 === first.field1.a3).toEqual(true);
    expect(result.field1 === second.field1).toEqual(false);
    expect(result.field2 === second.field2).toEqual(true);
    expect(result).toEqual({
      field1: {
        a3: { value: 12 },
      },
      field2: {
        b2: 20,
      },
    });
  });

  test('update 2', () => {
    type TestObject = {
      a: {
        one?: boolean;
        two?: number;
        three?: number;
        sub: { value: number };
      };
    };
    const first: TestObject = {
      a: {
        one: true,
        two: 2,
        sub: {
          value: 3,
        },
      },
    };
    const second: Patch<TestObject> = {
      a: {
        three: 3,
        $unset: ['one'], // $unset is a declarative operations
      },
    };
    const result = mc.update(first, second); // => { a: { two: 2,  three: 3, sub: { value: 3 }} }

    // the result is a new object
    expect(result !== first).toEqual(true);
    expect(result !== second).toEqual(true);
    // Property "a.sub" is immutable
    expect(result.a.sub === first.a.sub).toEqual(true);

    expect(result).toEqual({ a: { two: 2, three: 3, sub: { value: 3 } } });
  });
});
