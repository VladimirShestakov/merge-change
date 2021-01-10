const utils = require('../index.js').utils;

describe('Test type()', () => {

  test('Number', () => {
    const is = utils.instanceof(10, 'Number');
    expect(is).toEqual(true);
  });

  test('Extends class', () => {
    class A extends Array {}
    class B extends A {}
    expect(utils.instanceof(new B(), 'B')).toEqual(true);
    expect(utils.instanceof(new B(), 'A')).toEqual(true);
    expect(utils.instanceof(new B(), 'Array')).toEqual(true);
    expect(utils.instanceof(new B(), 'Object')).toEqual(true);

    expect(utils.instanceof(new B(), 'Null')).toEqual(false);
    expect(utils.instanceof(new B(), 'Undefined')).toEqual(false);
    expect(utils.instanceof(new B(), 'Set')).toEqual(false);
  });

  test('Constructor function', () => {
    function B () {}
    expect(utils.instanceof(new B(), 'B')).toEqual(true);
    expect(utils.instanceof(new B(), 'Object')).toEqual(true);
    expect(utils.instanceof(new B(), 'Null')).toEqual(false);
    expect(utils.instanceof(new B(), 'Undefined')).toEqual(false);
    expect(utils.instanceof(new B(), 'Set')).toEqual(false);
  });

});

