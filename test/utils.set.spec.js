const utils = require('../utils.js');

describe('Test set()', () => {

  test('set deep property', () => {
    const data = {
      prop: {}
    };
    utils.set(data, '/prop/deep/superDeep', 'new', false, '/');
    expect(data).toEqual({
      prop: {
        deep: {
          superDeep: 'new'
        }
      }
    });
  });

  test('set array element', () => {
    const data = {
      items: [
        'value1',
        'value2'
      ]
    };
    utils.set(data, '/items/1', 'new', false, '/');
    expect(data).toEqual({
      items: [
        'value1',
        'new'
      ]
    });
  });

});

