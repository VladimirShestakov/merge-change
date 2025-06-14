import { unset } from '../index';
import { plain } from '../../plain';

describe('Test unset()', () => {
  class Custom {
    protected value: {
      name?: string;
      sub?: {
        prop: {
          inner: number;
        };
      };
    };

    constructor(value = {}) {
      this.value = value;
    }

    get name() {
      return this.value.name;
    }

    get sub() {
      return this.value.sub;
    }

    toJSON() {
      return this.value;
    }
  }

  test('unset deep property', () => {
    const data = {
      prop: {
        deep: {
          some: 1,
          superDeep: 'value',
        },
      },
    };
    unset(data, 'prop.deep.superDeep');
    expect(plain(data)).toStrictEqual({
      prop: {
        deep: {
          some: 1,
        },
      },
    });
  });

  test('unset for custom object', () => {
    const data = new Custom({
      name: 'Test',
      sub: {
        prop: {
          inner: 100,
        },
      },
    });

    unset(data, '.sub.prop.inner');
    expect(plain(data)).toStrictEqual({
      name: 'Test',
      sub: {
        prop: {},
      },
    });
  });

  test('unset all props', () => {
    const data = {
      prop: 1,
      sub: {
        name: 2,
        list: [1, 2],
      },
    };
    unset(data, '*');
    expect(plain(data)).toStrictEqual({});
  });

  test('unset array', () => {
    const data = {
      prop: 1,
      list: [1, 2],
    };
    unset(data, 'list.*');
    expect(plain(data)).toStrictEqual({ prop: 1, list: [] });
  });

  test('unset number', () => {
    const data = {
      prop: 5,
    };
    unset(data, 'prop.*');
    expect(plain(data)).toStrictEqual({ prop: undefined });
  });
});
