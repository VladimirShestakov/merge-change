import mc from '../index';

describe('Test $leave', () => {
  test('leave one prop (merge)', () => {
    const first = {
      f1: { a1: [1, 2, 3, 4, 5], a2: 11, a3: 12 },
      f2: 10,
    };
    const second = {
      $leave: ['f1'],
    };
    const result = mc.merge(first, second);
    expect(result).toEqual({
      f1: { a1: [1, 2, 3, 4, 5], a2: 11, a3: 12 },
    });
    // Check ref
    expect(result === first).toEqual(false);
    expect(result.f1 === first.f1).toEqual(false);
    expect(result.f1.a1 === first.f1.a1).toEqual(false);
  });

  test('leave two prop', () => {
    const first = {
      f1: { a1: 10, a2: 11, a3: 12 },
      f2: 10,
      f3: 20,
    };
    const second = {
      $leave: ['f1', 'f3'],
    };
    const result = mc.merge(first, second);
    expect(result).toEqual({
      f1: { a1: 10, a2: 11, a3: 12 },
      f3: 20,
    });
  });

  test('leave one and sub prop', () => {
    const first = {
      f1: { a1: 10, a2: 11, a3: 12 },
      f2: 10,
      f3: 20,
    };
    const second = {
      $leave: ['f2', 'f1.a1'],
    };
    const result = mc.merge(first, second);
    expect(result).toEqual({
      f1: { a1: 10 },
      f2: 10,
    });
  });

  test('leave two elements', () => {
    const first = {
      f1: [1, 2, 3, 4, 5],
      f2: 10,
    };
    const second = {
      $leave: ['f1.0', 'f1.4'],
    };
    const result = mc.merge(first, second);
    expect(result).toEqual({
      f1: [1, 5],
    });
  });
});
