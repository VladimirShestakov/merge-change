const mc = require('../index.js');

describe('Test $set', () => {

  test('set property', () => {
    const first = {
      field1: {
        a1: 10,
      }
    };
    const second = {
      field2: {
        b1: 10
      },
      field1: {
        $set: {
          a2: 20
        }
      }
    };
    const result = mc.patch(first, second);
    expect(result).toEqual({
      field1: {
        a1: 10,
        a2: 20,
      },
      field2: {
        b1: 10
      },
    });
  });

});

