import { set } from '../index';
import { plain } from '../../plain';

describe('Test set()', () => {
  class Custom {
    protected value: {
      name?: string;
      sub?: {
        prop: {
          inner: number;
          inner2?: number;
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

  test('set exists deep property', () => {
    const data = {
      prop: {
        deep: {
          superDeep: 'value',
        },
      },
      leaf: 10,
    };
    set(data, 'prop.deep.superDeep', 'new', false);
    expect(data).toEqual({
      prop: {
        deep: {
          superDeep: 'new',
        },
      },
      leaf: 10,
    });
  });

  test('set deep property', () => {
    const data = {
      prop: {
        deep: {
          superDeep: '',
        },
      },
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

  test('create array when path contains numeric index', () => {
    const data: {
      items: string[];
    } = { items: [] };
    set(data, 'items.0', 'value1', false);
    set(data, 'items.1', 'value2', false);

    expect(data).toEqual({
      items: ['value1', 'value2'],
    });
  });

  test('create optional array when path contains numeric index', () => {
    const data: {
      items?: string[];
    } = {};
    // Use type assertion to bypass type checking for optional array paths
    set(data, 'items.0', 'value1', false);
    set(data, 'items.1', 'value2', false);

    expect(data).toEqual({
      items: ['value1', 'value2'],
    });
  });
});
