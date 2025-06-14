# merge-change

A powerful TypeScript library for deep merging, patching, and immutable updates of data structures.
The library provides a simple yet flexible API for complex data transformations, with support for
declarative operations, custom type merging rules, and difference tracking.

## Table of Contents

- [Installation](#installation)
- [Core Functions](#core-functions)
    - [merge](#merge)
    - [update](#update)
    - [patch](#patch)
- [Declarative Operations](#declarative-operations)
    - [$set](#set)
    - [$unset](#unset)
    - [$leave](#leave)
    - [$push](#push)
    - [$concat](#concat)
    - [$pull](#pull)
- [Custom Merge Logic](#custom-merge-logic)
- [Utility Functions](#utility-functions)
    - [get](#get)
    - [set](#set-1)
    - [unset](#unset-1)
    - [diff](#diff)
    - [type](#type)
    - [isInstanceof](#isinstanceof)
    - [plain](#plain)
    - [flat](#flat)
- [TypeScript Support](#typescript-support)
    - [Path Types](#path-types)
    - [Type Safety](#type-safety)
- [Path Format Options](#path-format-options)
- [License](#license)

## Installation

Install with npm:

```sh
npm install --save merge-change
```

## Core Functions

### merge

Creates a new object by deeply merging source objects without modifying them. This is ideal for
creating or extending objects from a template.

```typescript
import {merge} from 'merge-change';

// Create a new object with added properties and removed properties
const first = {
    a: {
        one: true,
        two: 2
    }
};

const second = {
    a: {
        three: 3,
        $unset: ['one'] // Declarative operation to remove 'one'
    }
};

const result = merge(first, second);
console.log(result); // { a: { two: 2, three: 3 } }

// Original objects remain unchanged
console.log(first); // { a: { one: true, two: 2 } }
console.log(second); // { a: { three: 3, $unset: ['one'] } }
```

### update

Performs an immutable merge, creating new instances only for properties that have changed. This is
perfect for state management in frameworks like React or Redux, as it preserves object references
for unchanged parts of the data structure.

```typescript
import {update} from 'merge-change';

const first = {
    a: {
        one: true,
        two: 2,
        sub: {
            value: 3
        }
    }
};

const second = {
    a: {
        three: 3,
        $unset: ['one'] // Declarative operation to remove 'one'
    }
};

const result = update(first, second);
console.log(result); // { a: { two: 2, three: 3, sub: { value: 3 } } }

// Result is a new object
console.log(result !== first); // true
console.log(result !== second); // true

// Unchanged nested objects maintain reference equality
console.log(result.a.sub === first.a.sub); // true
```

### patch

Merges objects by mutating the source object. This is useful for patching existing objects without
creating new instances.

```typescript
import {patch} from 'merge-change';

const first = {
    a: {
        one: true,
        two: 2
    }
};

const second = {
    a: {
        three: 3,
        $unset: ['one'] // Declarative operation to remove 'one'
    }
};

const result = patch(first, second);
console.log(result); // { a: { two: 2, three: 3 } }

// Result is the same object as first (mutated)
console.log(result === first); // true
console.log(result !== second); // true
```

## Declarative Operations

Declarative operations allow you to perform specific actions during merging, such as deleting
properties, replacing objects, or concatenating arrays.

### $set

Sets or replaces properties without deep merging.

```typescript
import {merge} from 'merge-change';

const result = merge(
        {
            a: {
                one: 1,
                two: 2
            }
        },
        {
            $set: {
                a: {
                    three: 3
                },
                'a.two': 20 // Property keys can be paths
            }
        }
);

console.log(result);
// {
//   a: {
//     one: 1,
//     two: 20,
//     three: 3
//   }
// }
```

### $unset

Removes properties by name or path.

```typescript
import {merge} from 'merge-change';

const result = merge(
        {
            a: {
                one: 1,
                two: 2
            }
        },
        {
            $unset: ['a.two']
        }
);

console.log(result);
// {
//   a: {
//     one: 1
//   }
// }
```

You can use the asterisk (`*`) to remove all properties:

```typescript
import {merge} from 'merge-change';

const result = merge(
        {
            a: {
                one: 1,
                two: 2
            }
        },
        {
            $unset: ['a.*']
        }
);

console.log(result);
// {
//   a: {}
// }
```

### $leave

Keeps only specified properties, removing all others.

```typescript
import {merge} from 'merge-change';

const result = merge(
        {
            a: {
                one: 1,
                two: 2,
                three: 3
            }
        },
        {
            a: {
                $leave: ['two']
            }
        }
);

console.log(result);
// {
//   a: {
//     two: 2
//   }
// }
```

### $push

Adds values to array properties.

```typescript
import {merge} from 'merge-change';

const result = merge(
        {
            prop1: ['a', 'b'],
            prop2: ['a', 'b']
        },
        {
            $push: {
                prop1: ['c', 'd'],
                prop2: {x: 'c'}
            }
        }
);

console.log(result);
// {
//   prop1: ['a', 'b', ['c', 'd']],
//   prop2: ['a', 'b', { x: 'c' }]
// }
```

### $concat

Concatenates arrays.

```typescript
import {merge} from 'merge-change';

const result = merge(
        {
            prop1: ['a', 'b'],
            prop2: ['a', 'b']
        },
        {
            $concat: {
                prop1: ['c', 'd'],
                prop2: {x: 'c'}
            }
        }
);

console.log(result);
// {
//   prop1: ['a', 'b', 'c', 'd'],
//   prop2: ['a', 'b', { x: 'c' }]
// }
```

### $pull

Removes elements from arrays by value equality.

```typescript
import {merge} from 'merge-change';

const result = merge(
        {
            items: [1, 2, 3, 2, 4]
        },
        {
            $pull: {
                items: 2
            }
        }
);

console.log(result);
// {
//   items: [1, 3, 4]
// }
```

## Custom Merge Logic

You can customize how specific types are merged by creating custom merge functions with the factory
functions `createMerge`, `createUpdate`, and `createPatch`.

Custom merge methods are named using the pattern `TypeName1_TypeName2`, where:

- `TypeName1` is the native type or constructor name of the first value
- `TypeName2` is the native type or constructor name of the second value

The type names are determined by the `type()` function, which returns:

- Native TypeScript types: `'string'`, `'number'`, `'boolean'`, `'object'`, `'Array'`, etc.
- Class names: `'Date'`, `'Map'`, `'Set'`, `'MyCustomClass'`, etc.
- Special types: `'null'`, `'undefined'`
- `unknown` type for margin with any types

```typescript
import {createMerge, createUpdate, createPatch} from 'merge-change';

// Create custom merge methods that always concatenate arrays
const customMethods = {
    // Method name is formed from the types: Array_Array
    Array_Array(first, second, kind, mc) {
        // merge - create new array with deep clone
        if (kind === 'merge') {
            return first.concat(second).map(item => mc(undefined, item));
        }

        // patch - mutate first array
        if (kind === 'patch') {
            first.splice(first.length, 0, ...second);
            return first;
        }

        // update - return first array if second is empty, or create new without clone
        if (second.length === 0) {
            return first;
        } else {
            return first.concat(second);
        }
    },

    // Example with custom class
    MyClass_object(first, second, kind, mc) {
        // Custom logic for merging MyClass with a plain object
        // ...
    },

    // Example with custom class and others types
    MyClass_unknown(first, second, kind, mc) {
        // Custom logic for merging MyClass with any other types
        // ...
    },

    // Example with native types
    number_string(first, second, kind, mc) {
        // Custom logic for merging a number with a string
        // ...
    }
};

// Create custom merge functions
const customMerge = createMerge(customMethods);
const customUpdate = createUpdate(customMethods);
const customPatch = createPatch(customMethods);

// Test the custom merge function
const result = customMerge(
        {items: [1, 2]},
        {items: [3, 4]}
);

console.log(result); // { items: [1, 2, 3, 4] }
```

## Utility Functions

### get

Retrieves a value from a nested object using a path.

```typescript
import {get} from 'merge-change';

const obj = {
    a: {
        b: {
            c: 'value'
        },
        items: [1, 2, 3]
    }
};

// Get a nested property
const value1 = get(obj, 'a.b.c');
console.log(value1); // 'value'

// Get an array element
const value2 = get(obj, 'a.items.1');
console.log(value2); // 2

// Get with a default value for non-existent paths
const value3 = get(obj, 'a.x.y', 'default');
console.log(value3); // 'default'

// Get with a custom separator
const value4 = get(obj, 'a/b/c', undefined, '/');
console.log(value4); // 'value'
```

### set

Sets a value in a nested object using a path, creating intermediate objects if needed.

```typescript
import {set} from 'merge-change';

const obj = {
    a: {
        b: {}
    }
};

// Set a nested property
set(obj, 'a.b.c', 'value');
console.log(obj); // { a: { b: { c: 'value' } } }

// Set with a custom separator
set(obj, 'a/b/d', 'another value', false, '/');
console.log(obj); // { a: { b: { c: 'value', d: 'another value' } } }

// Set only if the property doesn't exist
set(obj, 'a.b.c', 'new value', true);
console.log(obj); // { a: { b: { c: 'value', d: 'another value' } } }

// Create arrays when using numeric indices
set(obj, 'a.items.0', 'first');
set(obj, 'a.items.1', 'second');
console.log(obj); // { a: { b: { c: 'value', d: 'another value' }, items: ['first', 'second'] } }
```

### unset

Removes a property from a nested object using a path.

```typescript
import {unset} from 'merge-change';

const obj = {
    a: {
        b: {
            c: 'value',
            d: 'another value'
        },
        items: [1, 2, 3]
    }
};

// Remove a nested property
unset(obj, 'a.b.c');
console.log(obj); // { a: { b: { d: 'another value' }, items: [1, 2, 3] } }

// Remove an array element
unset(obj, 'a.items.1');
console.log(obj); // { a: { b: { d: 'another value' }, items: [1, 3] } }

// Remove all properties using asterisk
unset(obj, 'a.b.*');
console.log(obj); // { a: { b: {}, items: [1, 3] } }

// Remove with a custom separator
unset(obj, 'a/items', '/');
console.log(obj); // { a: { b: {} } }
```

### diff

Calculates the difference between two objects, returning an object with $set and $unset operations.

```typescript
import {diff} from 'merge-change';

const first = {
    name: 'value',
    profile: {
        surname: 'Surname',
        birthday: new Date('2000-01-01'),
        avatar: {
            url: 'pic.png'
        }
    },
    access: [100, 350, 200],
    secret: 'x'
};

const second = {
    login: 'value',
    profile: {
        surname: 'Surname2',
        avatar: {
            url: 'new/pic.png'
        }
    },
    access: [700]
};

// Calculate differences, ignoring the 'secret' property
const result = diff(first, second, {
    ignore: ['secret'],
    separator: '/'
});

console.log(result);
// {
//   $set: {
//     'login': 'value',
//     'profile/surname': 'Surname2',
//     'profile/avatar/url': 'new/pic.png',
//     'access': [700]
//   },
//   $unset: [
//     'profile/birthday',
//     'name'
//   ]
// }

// Apply the differences to the original object
import {merge} from 'merge-change';

const updated = merge(first, result);
console.log(updated);
// Similar to 'second' but with 'secret' preserved
```

### type

Returns the constructor name of a value.

```typescript
import {type} from 'merge-change';

console.log(type(null)); // 'null'
console.log(type(true)); // 'boolean'
console.log(type({})); // 'object'
console.log(type([])); // 'Array'
console.log(type(new Date())); // 'Date'
console.log(type(new Map())); // 'Map'
console.log(type(new Set())); // 'Set'
```

### isInstanceof

Checks if a value belongs to a class by the string name of the class.

```typescript
import {isInstanceof} from 'merge-change';

console.log(isInstanceof(100, 'Number')); // true
console.log(isInstanceof(new Date(), 'Date')); // true
console.log(isInstanceof(new Date(), 'Object')); // true
console.log(isInstanceof({}, 'Array')); // false

// Works with custom classes too
class MyClass {
}

console.log(isInstanceof(new MyClass(), 'MyClass')); // true
```

### plain

Converts a deep value to plain types if the value has a plain representation.

```typescript
import {plain} from 'merge-change';

const obj = {
    date: new Date('2021-01-07T19:10:21.759Z'),
    prop: {
        id: '6010a8c75b9b393070e42e68'
    },
    regex: /test/,
    fn: function () {
    }
};

const result = plain(obj);
console.log(result);
// {
//   date: '2021-01-07T19:10:21.759Z',
//   prop: {
//     id: '6010a8c75b9b393070e42e68'
//   },
//   regex: /test/,
//   fn: [Function]
// }
```

### flat

Converts a nested structure to a flat object with path-based keys.

```typescript
import {flat} from 'merge-change';

const obj = {
    a: {
        b: {
            c: 100
        }
    },
    d: [1, 2, {
        e: 'value'
    }]
};

// Flatten the object
const result = flat(obj, 'root', '.');
console.log(result);
// {
//   'root.a.b.c': 100,
//   'root.d.0': 1,
//   'root.d.1': 2,
//   'root.d.2.e': 'value'
// }

// Flatten with a different separator
const result2 = flat(obj, '', '/');
console.log(result2);
// {
//   'a/b/c': 100,
//   'd/0': 1,
//   'd/1': 2,
//   'd/2/e': 'value'
// }
```

## TypeScript Support

The library provides comprehensive TypeScript support with type-safe path operations.

### Path Types

The library includes several utility types for working with paths:

- `Patch<Obj>`: Enables partial updates for type `Obj`: objects combine `PatchOperation<Obj>` ($set, $unset, $pull, $push, $concat) with recursive partial patching of fields; arrays patch elements recursively as `Patch<U>[]`; primitives remain as `Obj`.
- `ExtractPaths<Obj, Sep>`: Extracts all possible paths in an object, including array indices.
- `ExtractPathsStarted<Obj, Sep>`: Extracts paths that start with a separator.
- `ExtractPathsAny<Obj, Sep>`: Union of `ExtractPaths` and `ExtractPathsStarted`.
- `ExtractPathsLeaf<Obj, Sep>`: Extracts paths only to leaf properties of an object.
- `ExtractPathsAsterisk<Obj, Sep>`: Extracts paths with asterisks for operations that clear all properties or elements.
- `PathToType<T, P, Sep>`: Extracts the value type for a specific path.

```typescript
import {ExtractPaths, PathToType} from 'merge-change';

// Define a type
type User = {
    id: string;
    profile: {
        name: string;
        age: number;
    };
    posts: Array<{
        id: string;
        title: string;
    }>;
};

// Extract all possible paths
type UserPaths = ExtractPaths<User, '.'>;
// UserPaths = "id" | "profile" | "profile.name" | "profile.age" | "posts" | "posts.0" | "posts.0.id" | "posts.0.title" | ...

// Get the type of a specific path
type PostTitle = PathToType<User, 'posts.0.title', '.'>;
// PostTitle = string
```

### Type Safety

The library's functions are type-safe, providing autocompletion and type checking for paths:

```typescript
import {get, set, unset} from 'merge-change';

const user = {
    id: '123',
    profile: {
        name: 'John',
        age: 30
    },
    posts: [
        {id: 'p1', title: 'First Post'}
    ]
};

// Type-safe get
const name = get(user, 'profile.name'); // Type: string
const post = get(user, 'posts.0'); // Type: { id: string, title: string }

// Type-safe set
set(user, 'profile.age', 31); // OK
set(user, 'posts.0.title', 'Updated Post'); // OK
// @ts-expect-error - Type error: 'invalid' is not a valid path
set(user, 'invalid.path', 'value');

// Type-safe unset
unset(user, 'profile.name'); // OK
unset(user, 'posts.0'); // OK
// @ts-expect-error - Type error: 'invalid' is not a valid path
unset(user, 'invalid.path');
```

## Path Format Options

The library supports different path formats:

1. **Dot notation** (default): `'a.b.c'`
2. **Slash notation**: `'a/b/c'`
3. **Custom separator**: Any string can be used as a separator

All functions that accept paths (`get`, `set`, `unset`, `diff`, etc.) allow specifying a custom
separator:

```typescript
import {get, set, unset, diff} from 'merge-change';

const obj = {
    a: {
        b: {
            c: 'value'
        }
    }
};

// Using dot notation (default)
get(obj, 'a.b.c'); // 'value'

// Using slash notation
get(obj, 'a/b/c', undefined, '/'); // 'value'

// Using custom separator
get(obj, 'a::b::c', undefined, '::'); // 'value'

// The same applies to set, unset, diff, etc.
set(obj, 'x/y/z', 'new value', false, '/');
unset(obj, 'a::b', '::');
diff(obj1, obj2, {separator: '/'});
```

## License

Author [VladimirShestakov](https://github.com/VladimirShestakov).
Released under the [MIT License](LICENSE).
