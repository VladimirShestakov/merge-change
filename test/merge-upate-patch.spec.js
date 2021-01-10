const mc = require('../index.js');

describe('Test merge()', () => {

  test('merge', () => {
    const first = {
      field1: {
        a1: 10,
        a2: 11,
        a3: 12
      }
    };
    const second = {
      field2: {
        b2: 20
      },
      $unset: ['field1.a1'],
      field1: {
        $unset: ['a2'],
      }
    };
    const result = mc.merge(first, second);
    expect(result===first).toEqual(false);
    expect(result.field1===first.field1).toEqual(false);
    expect(result.field1===second.field1).toEqual(false);
    expect(result.field2===second.field2).toEqual(false);
    expect(result).toEqual({
      field1: {
        a3: 12
      },
      field2: {
        b2: 20
      },
    });
  });

  test('patch', () => {
    const first = {
      field1: {
        a1: 10,
        a2: 11,
        a3: 12
      }
    };
    const second = {
      field2: {
        b2: 20
      },
      $unset: ['field1.a1'],
      field1: {
        $unset: ['a2'],
      }
    };
    const result = mc.patch(first, second);
    expect(result===first).toEqual(true);
    expect(result.field1===first.field1).toEqual(true);
    expect(result.field1===second.field1).toEqual(false);
    expect(result.field2===second.field2).toEqual(true);
    expect(result).toEqual({
      field1: {
        a3: 12
      },
      field2: {
        b2: 20
      },
    });
  });

  test('update', () => {
    const first = {
      field1: {
        a1: 10,
        a2: 11,
        a3: {
          value: 12
        }
      }
    };
    const second = {
      field2: {
        b2: 20
      },
      $unset: ['field1.a1'],
      field1: {
        $unset: ['a2'],
      }
    };
    const result = mc.update(first, second);
    expect(result===first).toEqual(false);
    expect(result.field1===first.field1).toEqual(false);
    expect(result.field1.a3===first.field1.a3).toEqual(true);
    expect(result.field1===second.field1).toEqual(false);
    expect(result.field2===second.field2).toEqual(true);
    expect(result).toEqual({
      field1: {
        a3: {value: 12}
      },
      field2: {
        b2: 20
      },
    });
  });

});

