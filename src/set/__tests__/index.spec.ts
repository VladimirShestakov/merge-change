import { set } from '../index';
import { plain } from '../../plain';

describe('Test set()', () => {
  class Custom {
    protected value: any;

    constructor(value = {}) {
      this.value = value;
    }

    toJSON() {
      return this.value;
    }
  }

  test('set deep property', () => {
    const data = {
      prop: {},
    };
    set(data, '.prop.deep.superDeep', 'new', false);
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
      items: ['value1', 'value2'],
    };
    set(data, '.items.1', 'new', false);
    expect(data).toEqual({
      items: ['value1', 'new'],
    });
  });

  test('set to custom object', () => {
    const data = new Custom({
      name: 'Test',
      sub: {
        prop: {
          inner: 100,
        },
      },
    });

    set(data, 'sub.prop.inner2', 200, false);

    expect(plain(data)).toEqual({
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
