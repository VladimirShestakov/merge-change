const mc = require('../index.js');

describe('Test $unset', () => {

  test('unset one prop (merge)', () => {
    const first = {
      f1: {a1: [1,2,3,4,5], a2: 11, a3: 12},
      f2: 10,
    };
    const second = {
      $unset: ['f2'],
    };
    const result = mc.merge(first, second);
    expect(result).toEqual({
      f1: {a1: [1,2,3,4,5], a2: 11, a3: 12},
    });
  });

});

