const utils = require('../utils.js');
const methods = require('../methods.js');

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
    expect(utils.plain(data)).toStrictEqual({
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
      // [methods.toOperation]() {
      //   return this.value;
      // }
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
    expect(utils.plain(data)).toStrictEqual({
      name: 'Test',
      sub: {
        prop: {
        },
      },
    });
  });

});

