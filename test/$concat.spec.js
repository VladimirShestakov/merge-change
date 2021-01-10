const mc = require('../index.js');

describe('Test $concat', () => {

  test('array with array', () => {

    const obj1 = {
      prop: ['a', 'b'],
    };
    const obj2 = {
      $concat: {
        prop: ['c', 'd'],
      },
    };
    const result = mc.update(obj1, obj2);
    expect(result).toEqual({prop: ['a', 'b', 'c', 'd']});
  });

  test('array with object', () => {

    const obj1 = {
      prop: ['a', 'b'],
    };
    const obj2 = {
      $concat: {
        prop: {x: 1},
      },
    };
    const result = mc.update(obj1, obj2);
    expect(result).toEqual({prop: ['a', 'b', {x: 1}]});
  });

});

