import { match } from '../index';

describe('Test match()', () => {
  test('simple', () => {
    expect(match({ prop1: '1', prop2: '2' }, { prop1: '1' })).toBe(true);
  });

  test('empty', () => {
    expect(match({ prop1: '1', prop2: '2' }, {})).toBe(true);
  });

  test('not match', () => {
    const errors: any[] = [];
    expect(match({ prop1: '1', prop2: '2' }, { prop1: '2' }, {}, '.', errors)).toBe(false);
    expect(errors).toStrictEqual(['prop1']);
  });

  test('not match prop 3', () => {
    const errors: any[] = [];
    expect(
      match(
        { prop1: '1', prop2: '2' },
        { prop1: '1', prop2: '2', prop3: '3', prop4: '4' },
        {},
        '.',
        errors,
      ),
    ).toBe(false);
    expect(errors).toStrictEqual(['prop3', 'prop4']);
  });

  test('deep match', () => {
    const errors: any[] = [];
    expect(
      match(
        {
          prop1: '1',
          prop2: { sub: { super: 2 } },
        },
        { 'prop2.sub.super': 2 },
        {},
        '.',
        errors,
      ),
    ).toBe(true);
    expect(errors).toStrictEqual([]);
  });

  test('array match', () => {
    expect(match({ prop1: '1', prop2: [1, 2, 3] }, { prop2: [1, 2, 3] })).toBe(true);
  });

  test('array not match', () => {
    expect(match({ prop1: '1', prop2: [1, 2, 3] }, { prop2: [3, 2, 1] })).toBe(false);
    expect(match({ prop1: '1', prop2: [1, 2, 3] }, { prop2: [1, 2] })).toBe(false);
    const errors: any[] = [];
    expect(match({ prop1: '1', prop2: [1, 2, 3] }, { prop2: [1, 2, 3, 4] }, {}, '.', errors)).toBe(
      false,
    );
    expect(errors).toStrictEqual(['prop2']);
  });

  test('array match object', () => {
    expect(
      match({ prop1: '1', prop2: [{ a: 1 }, { b: 2 }] }, { prop2: [{ a: 1 }, { b: 2 }] }),
    ).toBe(true);

    // Порядок имеет значение!
    const errors: any[] = [];
    expect(
      match(
        { prop1: '1', prop2: [{ a: 1 }, { b: 2 }] },
        { prop2: [{ b: 1 }, { a: 2 }] },
        {},
        '.',
        errors,
      ),
    ).toBe(false);
    expect(errors).toStrictEqual(['prop2']);
  });

  test('match Date', () => {
    const date = new Date();
    expect(match({ prop1: date }, { prop1: date.toISOString() })).toBe(true);
  });

  test('match with template', () => {
    expect(
      match(
        { prop1: '1', prop2: 'admin' },
        { prop2: '$session.user.name' },
        {
          session: {
            user: {
              id: 1,
              name: 'admin',
            },
          },
        },
      ),
    ).toBe(true);

    expect(
      match(
        { prop1: '1', prop2: 'admin' },
        { prop2: '$session.user.name' },
        {
          session: {},
        },
      ),
    ).toBe(false);
  });

  test('match with template when value not exists', () => {
    expect(
      match(
        { prop1: '1', prop2: 'admin' },
        { prop3: '$session.user.name' },
        {
          session: {
            user: null,
          },
        },
      ),
    ).toBe(false);
  });
});
