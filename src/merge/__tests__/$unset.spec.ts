import mc from '../index';

describe('Test $unset', () => {
  test('unset one prop (merge)', () => {
    const first = {
      f1: { a1: [1, 2, 3, 4, 5], a2: 11, a3: 12 },
      f2: 10,
    };
    const second = {
      $unset: ['f2'],
    };
    const result = mc.merge(first, second);
    expect(result).toEqual({
      f1: { a1: [1, 2, 3, 4, 5], a2: 11, a3: 12 },
    });
  });

  test('unset with set', () => {
    const first = {
      f1: { a1: [1, 2, 3, 4, 5], a2: 11, a3: 12 },
      f2: 10,
    };
    const second = {
      f5: 30,
      $set: {
        f3: '10',
        f4: '20',
      },
      $unset: ['f2', 'f3'],
    };
    const result = mc.merge(first, second);
    expect(result).toEqual({
      f1: { a1: [1, 2, 3, 4, 5], a2: 11, a3: 12 },
      f4: '20',
      f5: 30,
    });
  });

  test('set with empty unset', () => {
    const first = {};
    const second = {
      $set: {
        f1: '10',
        f2: '20',
      },
      $unset: [],
    };
    const result = mc.merge(first, second);
    expect(result).toEqual({
      f1: '10',
      f2: '20',
    });
  });

  test('clear root object', () => {
    const first = {
      f1: { a1: [1, 2, 3, 4, 5], a2: 11, a3: 12 },
      f2: 10,
    };
    const second = {
      $unset: ['*'],
    };
    const result = mc.merge(first, second);
    expect(result).toEqual({});
  });
});
