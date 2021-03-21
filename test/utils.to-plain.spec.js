const utils = require('../index.js').utils;

describe('Test plain()', () => {

  test('Number', () => {
    const value = utils.plain(10);
    expect(value).toBe(10);
  });

  test('Array with system types', () => {
    const value = utils.plain([10, 'string', true, null, undefined, new Date('2021-01-07T19:10:21.759Z'), /^[a-z]/u]);
    expect(value).toEqual([10, 'string', true, null, undefined, '2021-01-07T19:10:21.759Z', /^[a-z]/u]);
  });

  test('Custom class', () => {
    class A {
      constructor() {
        this.x = 10;
        this.y = 20
      }
    }
    const obj = {
      prop1: {
        prop2: {
          prop3: {
            v: new A()
          },
        }
      }
    }
    const value = utils.plain(obj);
    expect(value).toEqual({
      prop1: {
        prop2: {
          prop3: {
            v: {
              x: 10,
              y: 20
            }
          },
        }
      }
    });
  });

  test('Custom class with custom toJSON', () => {
    class A {
      constructor() {
        this.x = 10;
        this.y = 20
      }
      toJSON(){
        return this.x;
      }
    }
    const obj = {
      prop1: {
        prop2: {
          prop3: {
            v: new A()
          },
        }
      }
    }
    const value = utils.plain(obj);
    expect(value).toEqual({
      prop1: {
        prop2: {
          prop3: {
            v: 10
          },
        }
      }
    });
  });

  test('simple', ()=> {
    const plain = utils.plain({
      date: new Date('2021-01-07T19:10:21.759Z'),
      prop: {
        _id: '6010a8c75b9b393070e42e68'//new ObjectID('6010a8c75b9b393070e42e68')
      }
    });
    expect(plain).toEqual({
      date: '2021-01-07T19:10:21.759Z',
      prop: {
        _id: '6010a8c75b9b393070e42e68'
      }
    });
  })
});

