import { plain } from '../index';

describe('Test plain()', () => {
  test('Number', () => {
    const plainValue = plain(10);
    expect(plainValue).toBe(10);
  });

  test('Array with system types', () => {
    const plainValue = plain([
      10,
      'string',
      true,
      null,
      undefined,
      new Date('2021-01-07T19:10:21.759Z'),
      /^[a-z]/u,
    ]);
    expect(plainValue).toEqual([
      10,
      'string',
      true,
      null,
      undefined,
      '2021-01-07T19:10:21.759Z',
      /^[a-z]/u,
    ]);
  });

  test('Custom class', () => {
    class A {
      x: number;
      y: number;

      constructor() {
        this.x = 10;
        this.y = 20;
      }
    }

    const obj = {
      prop1: {
        prop2: {
          prop3: {
            v: new A(),
          },
        },
      },
    };
    const plainValue = plain(obj);
    expect(plainValue).toEqual({
      prop1: {
        prop2: {
          prop3: {
            v: {
              x: 10,
              y: 20,
            },
          },
        },
      },
    });
  });

  test('Custom class with custom toJSON', () => {
    class A {
      x: number;
      y: number;

      constructor() {
        this.x = 10;
        this.y = 20;
      }

      toJSON() {
        return this.x;
      }
    }

    const obj = {
      prop1: {
        prop2: {
          prop3: {
            v: new A(),
          },
        },
      },
    };
    const plainValue = plain(obj);
    expect(plainValue).toEqual({
      prop1: {
        prop2: {
          prop3: {
            v: 10,
          },
        },
      },
    });
  });

  test('simple', () => {
    const plainValue = plain({
      date: new Date('2021-01-07T19:10:21.759Z'),
      prop: {
        _id: '6010a8c75b9b393070e42e68', //new ObjectID('6010a8c75b9b393070e42e68')
      },
    });
    expect(plainValue).toEqual({
      date: '2021-01-07T19:10:21.759Z',
      prop: {
        _id: '6010a8c75b9b393070e42e68',
      },
    });
  });
});
