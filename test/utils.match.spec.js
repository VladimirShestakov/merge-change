const utils = require('../utils.js');

describe('Test match()', () => {

  test('simple', () => {
    expect(utils.match(
      {prop1: '1', prop2: '2'},
      {prop1: '1'}
      )).toBe(true);
  });

  test('empty', () => {
    expect(utils.match(
      {prop1: '1', prop2: '2'},
      {}
    )).toBe(true);
  });

  test('not match', () => {
    expect(utils.match(
      {prop1: '1', prop2: '2'},
      {prop1: '2'}
    )).toBe(false);
  });

  test('not match prop 3', () => {
    expect(utils.match(
      {prop1: '1', prop2: '2'},
      {prop1: '1', prop2: '2', prop3: '3'}
    )).toBe(false);
  });

  test('deep match', () => {
    expect(utils.match(
      {prop1: '1', prop2: {sub: {super: 2}}},
      {'prop2.sub.super': 2}
    )).toBe(true);
  });

  test('array match', () => {
    expect(utils.match(
      {prop1: '1', prop2: [1, 2, 3]},
      {'prop2': [1, 2, 3]}
    )).toBe(true);
  });

  test('array not match', () => {
    expect(utils.match(
      {prop1: '1', prop2: [1, 2, 3]},
      {'prop2': [3,2,1]}
    )).toBe(false);
    expect(utils.match(
      {prop1: '1', prop2: [1, 2, 3]},
      {'prop2': [1, 2]}
    )).toBe(false);
    expect(utils.match(
      {prop1: '1', prop2: [1, 2, 3]},
      {'prop2': [1,2,3,4]}
    )).toBe(false);
  });

  test('array match object', () => {
    expect(utils.match(
      {prop1: '1', prop2: [{a: 1}, {b: 2}]},
      {'prop2': [{a: 1}, {b: 2}]}
    )).toBe(true);
  });

  test('match Date', () => {
    const date = new Date();
    expect(utils.match(
      {prop1: date},
      {prop1: date.toISOString()}
    )).toBe(true);
  });

  test('match with template', () => {
    expect(utils.match(
      {prop1: '1', prop2: 'admin'},
      {prop2: '$session.user.name'},
      {
        session: {
          user: {
            id: 1,
            name: 'admin'
          }
        }
      }
    )).toBe(true);

    expect(utils.match(
      {prop1: '1', prop2: 'admin'},
      {prop2: '$session.user.name'},
      {
        session: {}
      }
    )).toBe(false);
  });

  test('match with template when value not exists', () => {
    expect(utils.match(
      {prop1: '1', prop2: 'admin'},
      {prop3: '$session.user.name'},
      {
        session: {
          user: null
        }
      }
    )).toBe(false);
  });
});

