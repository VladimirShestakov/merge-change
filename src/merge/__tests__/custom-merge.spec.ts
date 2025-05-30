import mc, { createUpdate } from '../index';
import { MergeChangeKind, MergeFn } from '../types';

describe('Custom merge', () => {
  const Array_Array: MergeFn = (first, second, kind, mc) => {
    // merge mode - create new array with deep clone
    if (kind === MergeChangeKind.MERGE) {
      return first.concat(second).map((item: unknown) => mc(undefined, item));
    }
    // patch mode - mutate first array
    if (kind === MergeChangeKind.PATCH) {
      first.splice(first.length, 0, ...second);
      return first;
    }
    // update mode - return first array if second is empty, or create new without clone
    if (second.length === 0) {
      return first;
    } else {
      return first.concat(second);
    }
  };

  test('custom merge array', () => {
    const customUpdate = createUpdate({ Array_Array });
    const obj1 = { a: 1, b: [1, 2, 3] };
    const obj2 = { a: 2, b: [3, 4, 5], c: 3 };
    const result = customUpdate(obj1, obj2);
    expect(result).toEqual({ a: 2, b: [1, 2, 3, 3, 4, 5], c: 3 });
  });

  test('default merge array', () => {
    const customMerge = createUpdate({});
    const obj1 = {
      a: 10,
      b: {
        c: 1,
        d: [1, 2, 3],
        e: [{ m: 1 }, { m: 2 }],
        i: [
          { _id: 1, _type: 'user' },
          { _id: 2, _type: 'news' },
        ],
      },
    };
    const obj2 = {
      a: 2,
      b: {
        d: [3, 4, 5],
        e: [{ m: 2 }, { m: 3 }],
        i: [
          { _id: 1, prop: 'v1' },
          { _id: 3, _type: 'news', prop: 'v2' },
        ],
      },
      n: 3,
    };
    const result = customMerge(obj1, obj2);

    expect(result).toEqual({
      a: 2,
      b: {
        c: 1,
        d: [/*1,2,*/ 3, 4, 5],
        e: [/*{m:1}, {m:2},*/ { m: 2 }, { m: 3 }],
        i: [
          { _id: 1, /*_type: 'user',*/ prop: 'v1' },
          /*{_id: 2, _type: 'news'}, */ {
            _id: 3,
            _type: 'news',
            prop: 'v2',
          },
        ],
      },
      n: 3,
    });
  });

  test('not object with object', () => {
    const obj1 = null;
    const obj2 = { a: 1 };
    const result = mc.merge(obj1, obj2);
    expect(result).toEqual({ a: 1 });
  });
});
