import { isInstanceof } from '../index';

describe('Test type()', () => {
  test('number', () => {
    const is = isInstanceof(10, 'number');
    expect(is).toEqual(true);
  });

  test('Extends class', () => {
    class A extends Array {}

    class B extends A {}

    expect(isInstanceof(new B(), 'B')).toEqual(true);
    expect(isInstanceof(new B(), 'A')).toEqual(true);
    expect(isInstanceof(new B(), 'Array')).toEqual(true);
    expect(isInstanceof(new B(), 'object')).toEqual(true);

    expect(isInstanceof(new B(), 'null')).toEqual(false);
    expect(isInstanceof(new B(), 'undefined')).toEqual(false);
    expect(isInstanceof(new B(), 'Set')).toEqual(false);
  });

  test('Constructor function', () => {
    type B = {};

    interface BConstructor {
      new (): B;
    }

    const B: BConstructor = function (this: B) {
      //
    } as any;

    expect(isInstanceof(new B(), 'B')).toEqual(true);
    expect(isInstanceof(new B(), 'object')).toEqual(true);
    expect(isInstanceof(new B(), 'null')).toEqual(false);
    expect(isInstanceof(new B(), 'undefined')).toEqual(false);
    expect(isInstanceof(new B(), 'Set')).toEqual(false);
  });
});
