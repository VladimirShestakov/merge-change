const utils = require('../index.js').utils;

describe('Test type()', () => {

  test('Number', () => {
    const newState = utils.type(10);
    expect(newState).toEqual('Number');
  });

  test('NaN is Number', () => {
    const newState = utils.type(NaN);
    expect(newState).toEqual('Number');
  });

  test('float is Number', () => {
    const newState = utils.type(-1.93892389);
    expect(newState).toEqual('Number');
  });

  test('Null', () => {
    const newState = utils.type(null);
    expect(newState).toEqual('Null');
  });

  test('String', () => {
    const newState = utils.type('string');
    expect(newState).toEqual('String');
  });

  test('Boolean', () => {
    const newState = utils.type(true);
    expect(newState).toEqual('Boolean');
  });

  test('Object', () => {
    const newState = utils.type({a:10});
    expect(newState).toEqual('Object');
  });

  test('Class instance', () => {
    function A() {
      this.x = 0;
    }
    const newState = utils.type(new A());
    expect(newState).toEqual('A');
  });

  test('Extended class', () => {
    class A {}
    class B extends A{}
    const newState = utils.type(new B());
    expect(newState).toEqual('B');
  });

  test('Extended class of Array', () => {
    class B extends Array{}
    const newState = utils.type(new B());
    expect(newState).toEqual('B');
  });

  test('Array', () => {
    const newState = utils.type([1,2,3]);
    expect(newState).toEqual('Array');
  });

  test('Array instance', () => {
    const newState = utils.type(new Array(10));
    expect(newState).toEqual('Array');
  });

  test('Date', () => {
    const newState = utils.type(new Date());
    expect(newState).toEqual('Date');
  });

  test('RegExp', () => {
    const newState = utils.type(/[a-z]/);
    expect(newState).toEqual('RegExp');
  });

  test('Function', () => {
    const newState = utils.type(() => {});
    expect(newState).toEqual('Function');
  });

  test('Undefined', () => {
    const newState = utils.type(undefined);
    expect(newState).toEqual('Undefined');
  });

  test('Symbol', () => {
    const newState = utils.type(Symbol('A'));
    expect(newState).toEqual('Symbol');
  });

  test('Map', () => {
    const newState = utils.type(new Map());
    expect(newState).toEqual('Map');
  });

  test('Object without proto', () => {
    const obj = Object.create(null);
    expect('Object').toEqual('Object');
  })
});

