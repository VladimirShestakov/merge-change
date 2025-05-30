import mc from '../index';

describe('Test $push', () => {
  test('array with array and object', () => {
    const obj1 = {
      prop1: ['a', 'b'],
      prop2: ['a', 'b'],
    };
    const obj2 = {
      $push: {
        prop1: ['c', 'd'],
        prop2: { x: 'c' },
      },
    };
    const result = mc.update(obj1, obj2);
    expect(result).toEqual({
      prop1: ['a', 'b', ['c', 'd']],
      prop2: ['a', 'b', { x: 'c' }],
    });
  });

  test('array with string', () => {
    const obj1 = {
      prop: ['a', 'b'],
    };
    const obj2 = {
      $push: {
        prop: 'x',
      },
    };
    const result = mc.update(obj1, obj2);
    expect(result).toEqual({ prop: ['a', 'b', 'x'] });
  });
});
