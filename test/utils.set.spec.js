const utils = require('../utils.js');
const methods = require('../methods.js');

describe('Test set()', () => {

  test('set deep property', () => {
    const data = {
      prop: {},
    };
    utils.set(data, '/prop/deep/superDeep', 'new', false, '/');
    expect(data).toEqual({
      prop: {
        deep: {
          superDeep: 'new',
        },
      },
    });
  });

  test('set array element', () => {
    const data = {
      items: [
        'value1',
        'value2',
      ],
    };
    utils.set(data, '/items/1', 'new', false, '/');
    expect(data).toEqual({
      items: [
        'value1',
        'new',
      ],
    });
  });

  test('set to custom object', () => {
    class Custom {
      constructor(value = {}) {
        this.value = value;
      }

      [methods.toOperation]() {
        return this.value;
      }

      toJSON() {
        return this.value;
      }
    }

    let data = new Custom({
      name: 'Test',
      sub: {
        prop: {
          inner: 100,
        },
      },
    });

    utils.set(data, 'sub.prop.inner2', 200, false, '.');

    expect(utils.plain(data)).toEqual({
      name: 'Test',
      sub: {
        prop: {
          inner: 100,
          inner2: 200,
        },
      },
    });
  });
});

