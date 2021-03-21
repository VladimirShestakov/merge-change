const utils = require('../utils.js');

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

      operation$set(path, value, doNotReplace, separator = '.') {
        return utils.set(this.value, path, value, doNotReplace, separator);
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

    expect(utils.toPlain(data)).toEqual({
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

