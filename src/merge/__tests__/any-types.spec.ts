import mc from '../index';

describe('Test any types', () => {
  test('undefined + undefined', () => {
    const first = undefined;
    const second = undefined;
    const result = mc.merge(first, second);
    expect(result).toEqual(undefined);
  });

  test('undefined + operations', () => {
    const first = undefined;
    const second = { $set: { x: 0 } };
    const result = mc.merge(first, second);
    expect(result).toEqual({ x: 0 });

    const second2 = { $set: { x: 0 } };
    const result2 = mc.update(first, second2);
    expect(result2).toEqual({ x: 0 });

    const second3 = { $set: { x: 0 } };
    const result3 = mc.patch(first, second3);
    expect(result3).toEqual({ x: 0 });
  });

  test('object + operations', () => {
    const first = {};
    const second = { $set: { x: 0 } };
    const result = mc.merge(first, second);
    expect(result).toEqual({ x: 0 });

    const result2 = mc.update(first, second);
    expect(result2).toEqual({ x: 0 });

    const result3 = mc.patch(first, second);
    expect(result3).toEqual({ x: 0 });
  });
});
