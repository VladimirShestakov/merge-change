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


  test('unset all props', () => {
    const data = {
      prop: 1,
      sub: {
        name: 2,
        list: [1, 2]
      },
    };
    utils.unset(data, '*');
    expect(utils.plain(data)).toStrictEqual({ });
  });

  test('unset array', () => {
    const data = {
      prop: 1,
      list: [1, 2],
    };
    utils.unset(data, 'list.*');
    expect(utils.plain(data)).toStrictEqual({prop: 1, list: [] });
  });

  test('unset number', () => {
    const data = {
      prop: 5,
    };
    utils.unset(data, 'prop.*');
    expect(utils.plain(data)).toStrictEqual({prop: undefined });
  });


});

