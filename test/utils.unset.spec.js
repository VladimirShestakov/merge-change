const utils = require('../utils.js');

describe('Test unset()', () => {

  test('unset deep property', () => {
    const data = {
      prop: {
        deep: {
          some: 1,
          superDeep: 'value',
        },
      },
    };
    utils.unset(data, '/prop/deep/superDeep', '/');
    expect(utils.toPlain(data)).toStrictEqual({
      prop: {
        deep: {
          some: 1
        },
      },
    });
  });

  test('unset for custom object', () => {
    class Custom {
      constructor(value = {}) {
        this.value = value;
      }
      operation$unset(path, separator = '.') {
        return utils.unset(this.value, path, separator);
      }
      toJSON(){
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

    utils.unset(data, '/sub/prop/inner', '/');
    expect(utils.toPlain(data)).toStrictEqual({
      name: 'Test',
      sub: {
        prop: {
        },
      },
    });
  });

});

