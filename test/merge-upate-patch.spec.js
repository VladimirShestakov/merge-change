const mc = require('../index.js');

describe('Test merge()', () => {

  test('merge', () => {
    const first = {
      field1: {
        a1: 10,
        a2: 11,
        a3: 12,
      },
    };
    const second = {
      field2: {
        b2: 20,
      },
      $unset: ['field1.a1'],
      field1: {
        $unset: ['a2'],
      },
    };
    const result = mc.merge(first, second);
    expect(result === first).toEqual(false);
    expect(result.field1 === first.field1).toEqual(false);
    expect(result.field1 === second.field1).toEqual(false);
    expect(result.field2 === second.field2).toEqual(false);
    expect(result).toEqual({
      field1: {
        a3: 12,
      },
      field2: {
        b2: 20,
      },
    });
  });

  test('patch', () => {
    const first = {
      field1: {
        a1: 10,
        a2: 11,
        a3: 12,
      },
    };
    const second = {
      field2: {
        b2: 20,
      },
      $unset: ['field1.a1'],
      field1: {
        $unset: ['a2'],
      },
    };
    const result = mc.patch(first, second);
    expect(result === first).toEqual(true);
    expect(result.field1 === first.field1).toEqual(true);
    expect(result.field1 === second.field1).toEqual(false);
    expect(result.field2 === second.field2).toEqual(true);
    expect(result).toEqual({
      field1: {
        a3: 12,
      },
      field2: {
        b2: 20,
      },
    });
  });

  test('patch 2', () => {
    const first = {
      field: {
        sub1: {
          value: 10,
        },
        sub2: {
          deepSub: {
            value: 20,
          },
        },
      },
    };
    const second = {
      field: {
        sub2: {
          deepSub: {
            second: 30,
          },
        },
      },
    };
    const result = mc.patch(first, second);
    expect(result === first).toEqual(true);
    expect(result.field === first.field).toEqual(true);
    expect(result.field.sub2 === first.field.sub2).toEqual(true);
    expect(result.field.sub2.deepSub === first.field.sub2.deepSub).toEqual(true);
    expect(result).toStrictEqual({
      field: {
        sub1: {value: 10},
        sub2: {
          deepSub: {
            value: 20,
            second: 30,
          },
        },
      },
    });
  });

  test('update', () => {
    const first = {
      field1: {
        a1: 10,
        a2: 11,
        a3: {
          value: 12,
        },
      },
    };
    const second = {
      field2: {
        b2: 20,
      },
      $unset: ['field1.a1'],
      field1: {
        $unset: ['a2'],
      },
    };
    const result = mc.update(first, second);
    expect(result === first).toEqual(false);
    expect(result.field1 === first.field1).toEqual(false);
    expect(result.field1.a3 === first.field1.a3).toEqual(true);
    expect(result.field1 === second.field1).toEqual(false);
    expect(result.field2 === second.field2).toEqual(true);
    expect(result).toEqual({
      field1: {
        a3: {value: 12},
      },
      field2: {
        b2: 20,
      },
    });
  });

  test('update 2', () => {
    let first = {
      a: {
        one: true,
        two: 2,
        sub: {
          value: 3,
        },
      },
    };
    let second = {
      a: {
        three: 3,
        $unset: ['one'], // $unset is a declarative operations
      },
    };
    const result = mc.update(first, second); // => { a: { two: 2,  three: 3, sub: { value: 3 }} }
    console.log(result);

    // result is a new object
    expect(result !== first).toEqual(true);
    expect(result !== second).toEqual(true);
    // Property "a.sub" is immutable
    expect(result.a.sub === first.a.sub).toEqual(true);

    expect(result).toEqual({a: {two: 2, three: 3, sub: {value: 3}}});
  });

});

