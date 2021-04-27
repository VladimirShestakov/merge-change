const utils = require('../utils.js');
const methods = require('../methods.js');

describe('Test get()', () => {

  test('get deep property', () => {
    const data = {
      prop: {
        deep: {
          superDeep: 'value',
        },
      },
    };
    const value = utils.get(data, '/prop/deep/superDeep', null, '/');
    expect(value).toEqual('value');
  });

  test('get array element', () => {
    const data = {
      items: [
        'value1',
        'value2',
      ],
    };
    const value = utils.get(data, 'items/1', null, '/');
    expect(value).toEqual('value2');
  });

  test('get if not exists or null', () => {
    const data = {
      prop: null,
    };
    expect(utils.get(data, '/prop/deep/superDeep', undefined, '/')).toEqual(undefined);
    expect(utils.get(data, '/prop2/superDeep', undefined, '/')).toEqual(undefined);
  });

  test('get from custom object', () => {
    class Custom {
      constructor(value = {}) {
        this.value = value;
      }
      [methods.toOperation](){
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

    const value = utils.get(data, 'sub.prop.inner', null, '.');
    expect(value).toEqual(100);
  });

});

