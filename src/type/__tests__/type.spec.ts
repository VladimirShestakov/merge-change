import { type } from '../index';

describe('Test type()', () => {
  test('Null', () => {
    const newState = type(null);
    expect(newState).toEqual('null');
  });

  test('Undefined', () => {
    const newState = type(undefined);
    expect(newState).toEqual('undefined');
  });

  test('Number', () => {
    const newState = type(10);
    expect(newState).toEqual('number');
  });

  test('NaN is Number', () => {
    const newState = type(NaN);
    expect(newState).toEqual('number');
  });

  test('float is Number', () => {
    const newState = type(-1.93892389);
    expect(newState).toEqual('number');
  });

  test('String', () => {
    const newState = type('string');
    expect(newState).toEqual('string');
  });

  test('Boolean', () => {
    const newState = type(true);
    expect(newState).toEqual('boolean');
  });

  test('Object', () => {
    const newState = type({ a: 10 });
    expect(newState).toEqual('object');
  });

  test('Object without proto', () => {
    const obj = Object.create(null);
    expect(type(obj)).toEqual('object');
  });

  test('Symbol', () => {
    const newState = type(Symbol('A'));
    expect(newState).toEqual('symbol');
  });

  test('Contractor instance', () => {
    // Интерфейс для экземпляра
    interface A {
      x: number;
    }

    // Тип для конструктора
    interface AConstructor {
      new (): A;
    }

    // Функция-конструктор
    const A = function (this: A) {
      this.x = 0;
    } as unknown as AConstructor;

    const newState = type(new A());
    expect(newState).toEqual('A');
  });

  test('Class instance', () => {
    class A {}

    const value = type(new A());
    expect(value).toEqual('A');
  });

  test('Extended class', () => {
    class A {}

    class B extends A {}

    const value = type(new B());
    expect(value).toEqual('B');
  });

  test('Class in lowercase', () => {
    class a {}

    class b extends a {}

    const value = type(new b());
    expect(value).toEqual('b');
  });

  test('Extended class of Array', () => {
    class B extends Array {}

    const value = type(new B());
    expect(value).toEqual('B');
  });

  test('Array', () => {
    const value = type([1, 2, 3]);
    expect(value).toEqual('Array');
  });

  test('Array instance', () => {
    const value = type(new Array(10));
    expect(value).toEqual('Array');
  });

  test('Date', () => {
    const value = type(new Date());
    expect(value).toEqual('Date');
  });

  test('RegExp', () => {
    const value = type(/[a-z]/);
    expect(value).toEqual('RegExp');
  });

  test('Function', () => {
    const value = type(() => {});
    expect(value).toEqual('Function');
  });

  test('Map', () => {
    const value = type(new Map());
    expect(value).toEqual('Map');
  });

  test('Set', () => {
    const value = type(new Set());
    expect(value).toEqual('Set');
  });

  test('WeakMap', () => {
    const value = type(new WeakMap());
    expect(value).toEqual('WeakMap');
  });

  test('WeakSet', () => {
    const value = type(new WeakSet());
    expect(value).toEqual('WeakSet');
  });

  test('Promise', () => {
    const value = type(Promise.resolve());
    expect(value).toEqual('Promise');
  });

  test('Error', () => {
    const value = type(new Error('error'));
    expect(value).toEqual('Error');
  });

  test('Int8Array', () => {
    const value = type(new Int8Array(2));
    expect(value).toEqual('Int8Array');
  });

  test('ArrayBuffer', () => {
    const value = type(new ArrayBuffer(8));
    expect(value).toEqual('ArrayBuffer');
  });
});
