import { get } from '../index';

describe('Test get()', () => {
  test('get deep property', () => {
    const data = {
      prop: {
        deep: {
          superDeep: 'value',
        },
      },
    };
    const value = get(data, 'prop.deep.superDeep', null, '.');
    expect(value).toEqual('value');
  });

  test('get deep property with leading separator', () => {
    const data = {
      prop: {
        deep: {
          superDeep: 'value',
        },
      },
    };
    const value = get(data, '.prop.deep.superDeep', null, '.');
    expect(value).toEqual('value');
  });

  test('get array element', () => {
    const data = {
      items: ['value1', 'value2'],
    };
    const value = get(data, 'items/1', null, '/');
    expect(value).toEqual('value2');
  });

  test('get array element with leading separator', () => {
    const data = {
      items: ['value1', 'value2'],
    };
    const value = get(data, '/items/1', null, '/');
    expect(value).toEqual('value2');
  });

  test('get if not exists or null', () => {
    const data = {
      prop: null,
    };
    expect(get(data, 'prop.deep.superDeep' as any)).toEqual(undefined);
    expect(get(data, 'prop2.superDeep' as any)).toEqual(undefined);
  });

  test('get if not exists or null with leading separator', () => {
    const data = {
      prop: null,
    };
    expect(get(data, '.prop.deep.superDeep' as any)).toEqual(undefined);
    expect(get(data, '.prop2.superDeep' as any)).toEqual(undefined);
  });

  test('get from custom object', () => {
    class Custom {
      name = 'Test';
      sub = {
        prop: {
          inner: 100,
        },
      };
    }

    const data = new Custom();

    const value = get(data, 'sub.prop.inner', null);
    expect(value).toEqual(100);
  });

  test('get from custom object with leading separator', () => {
    class Custom {
      name = 'Test';
      sub = {
        prop: {
          inner: 100,
        },
      };
    }

    const data = new Custom();

    const value = get(data, '.sub.prop.inner', null);
    expect(value).toEqual(100);
  });
});
