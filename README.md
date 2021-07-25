# merge-change

Simple library for **deep merge** of objects and other types, also for **patches** and **immutable updates**.
By default, merge works for "plain objects".
Values of other types are replaced, but you can **customize merging** between specific types.
Also, you can use **declarative operations** to specific merge like `unset`, `leave`, `push` and other.
For example to remove some properties of object, to replace "plain objects", to concat arrays.
Calculating diffs between two values.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save merge-change
```

## API

### Merge

Merge with **deep cloning** without changing the source objects. Great for creating or extending objects from the example (source).

```js
mc.merge(source, ...values);
```
Example
```js
const mc = require('merge-change');

// Create new object with adding "a.three" and deleting "a.one"
let first = {
  a: {
    one: true,
    two: 2
  }
};
let second = {
  a: {
    three: 3,
    $unset: ['one'] // $unset is a declarative operations
  }
};

const result = mc.merge(first, second);

console.log(result);
```
```log
{ a: { two: 2,  three: 3} }
```

### Patch

Merge with **mutation** of the source objects. Nice for patching. New instances will not be created.

```js
mc.patch(source, ...patches);
```

```js
let first = {
  a: {
    one: true,
    two: 2
  }
};
let second = {
  a: {
    three: 3,
    $unset: ['one'] // $unset is a declarative operations
  }
};

const result = mc.patch(first, second); // => { a: { two: 2,  three: 3} }

// result is a mutated first argument
console.log(result === first); // => true
console.log(result !== second); // => true
```

### Update

**Immutable merge** - create new instances only if there are diffs (also in inner properties). Nice for state management.

```js
mc.update(source, ...changes);
```

```js
let first = {
  a: {
    one: true,
    two: 2,
    sub: {
      value: 3
    }
  }
};
let second = {
  a: {
    three: 3,
    $unset: ['one'] // $unset is a declarative operations
  }
};

const result = mc.update(first, second); // => { a: { two: 2,  three: 3, sub: { value: 3 }} }

// result is a new object
console.log(result !== first); // => true
console.log(result !== second); // => true

// object "a.sub" is unchanged
console.log(result.a.sub === first.a.sub); // => true
```

## Declarative operations

When merging objects, you can perform delete and replace properties at the same time.
Use declarative operations in second or next arguments. Supported in all merge methods.
The syntax is similar to mongodb.

### `$set`

To set (or replace) property without deep merge.

```js
const result = mc.merge(
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
      'a.two': 20 // Fields keys can be path.
    }
  }
);
console.log(result);
```

Result
```json
{
  "a": {
    "one": 1, 
    "two": 20,
    "three": 3
  }
}
```

### `$unset`

To unset properties by name (or path)

 ```js
 const result = mc.merge(
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
 ```

Result
 ```json
 {
   "a": {
     "one": 1
   }
 }
 ```

### `$leave`

To leave properties by name (or path). All other properties will be removed.

 ```js
 const result = mc(
   {
     a: {
       one: 1, 
       two: 2,
       tree: 3
     }
   }, 
   {
     a: {
       $leave: ['two']
     }
   }
 );
 console.log(result);
 ```

Result
```json
 {
   "a": {
     "two": 2
   }
 }
 ```

### `$push`

To push one value to the array property. The source property must be an array.

 ```js
 const result = mc(
   // First object
   {
     prop1: ['a', 'b'],
     prop2: ['a', 'b'],
   }, 
   // Merge    
   {
     $push: {
       prop1: ['c', 'd'],
       prop2: {x: 'c'}
     },
   }
 );
 console.log(result);
 ```

Result
 ```json
 {
   "prop1": ["a", "b", ["c", "d"]],
   "prop2": ["a", "b", {"x": "c"}]
 }
 ```

### `$concat`

To union arrays.

The source property must be an array. The property in secondary arguments may not be an array.

 ```js
 const result = mc(
   // First object
   {
     prop1: ['a', 'b'],
     prop2: ['a', 'b'],
   }, 
   // Merge    
   {
     $concat: {
       prop1: ['c', 'd'],
       prop2: {x: 'c'}
     },
   }
 );
 console.log(result);
 ```

Result
 ```json
 {
   "prop1": ["a", "b", "c", "d"],
   "prop2": ["a", "b", {"x": "c"}]
 }
 ```


## Customize merge

You can declare function for merge custom types (or override default logic). Returns previous merge method.

`mc.addMerge(type1, type2, callback)`

- `type1, type2` - constructor name of the first and second values: `Number, String, Boolean, Object, Array, Date, RegExp, Function, Undefined, Null, Symbol, Set, Map` and other system and custom constructor names
- `callback` - merge function with argument: (first, second, kind)
    - `first` - first value for merge
    - `second` - second value for merge
    - `kind` - name of merging method, such as "merge", "patch", "update". 

For example, if you always need to union arrays, you can declare method to merge array with array. 

```js
const previous = mc.addMerge('Array', 'Array', function(first, second, kind){
  // merge - creaete new array with deep clone
  if (kind === 'merge'){
    return first.concat(second).map(item => mc.merge(undefined, item));
  }
  // patch - mutate first array
  if (kind === 'patch'){
    first.splice(first.length, 0, ...second);
    return first;
  }
  // update - return first array if second is empty, or create new without clone
  if (second.length === 0){
    return first;
  } else {
    return first.concat(second);
  }
});

// reset custom method
mc.addMerge('Array', 'Array', previous);
```

## Customize declarative operation

You can declare function for declarative operation (or override default logic). Returns previous operation method.

`mc.addOperation(name, callback)`

- `name` - operation name, for example "$concat"
- `callback` - operation function with argument: (source, params). Return new value or source.
    - `source` - the value in which the operation is defined (`source: {$concat: params}`)
    - `params` - value of operator (`$concat: params`)

For example, if sometimes need to union arrays, you can declare declarative operation $concat (it exists in the library).

```js
const previous = mc.addOperation('$concat', function(source, params){
  const paths = Object.keys(params);
  for (const path of paths) {
    let value = params[path];
    let array = utils.get(source, path, []);
    if (Array.isArray(array)) {
      array = array.concat(value);
      utils.set(source, path, array);
    } else {
      throw new Error('Cannot concat on not array');
    }
  }
  return paths.length > 0;
});

// reset custom operation
mc.addOperation('$concat', previous);
```

## Utils

Useful functions - utilities

```js
const utils = require('merge-change').utils;
```

### `utils.diff(source, compare, {ignore = [], separator = '.'})`

To calculate the difference between `source` and `compare` value. 
The return value is an object with `$set` and `$unset` operators. Return value can be used in merge functions.
The `ignore` parameter - is a list of properties that are not included in the comparison.

```js
const first = {
  name: 'value',
  profile: {
    surname: 'Surname',
    birthday: new Date(),
    avatar: {
      url: 'pic.png'
    }
  },
  access: [100, 350, 200],
  secret: 'x'
}

const second = {
  login: 'value',
  profile: {
    surname: 'Surname2',
    avatar: {
      url: 'new/pic.png'
    }
  },
  access: [700]
}

const diff = utils.diff(first, second, {ignore: ['secret'], separator: '/'});
```
Result (diff)
```
{
  $set: {
    'login': 'value',
    'profile.surname': 'Surname2',
    'profile.avatar.url': 'new/pic.png',
    'access': [ 700 ]
  },
  $unset: [ 
    'profile.birthday', 
    'name'
  ]
}
```

### `utils.type(value)`

Get real type of any value. The return value is a string - the name of the constructor.

```js
utils.type(null); // => 'Null'
utils.type(true); // => 'Boolean'
utils.type(new ObjectId()); // => 'ObjectID'
```

### `utils.instanceof(value, className)`

Checking instance of class. `className` is string (not constructor). The return value is a boolean.

```js
utils.instanceof(100, 'Number'); // => true
utils.instanceof(new MyClass(), 'MyClass'); // => true
utils.instanceof(new MyClass(), 'Object'); // => true
```

### `utils.plain(value)`

Converting deep value to plain types if value has plain representation. For example, all dates are converted to a string, but RegEx not.
To customize conversion, you can define the `[methods.toPlain]()` method in your object.
Nice for unit tests.

> The method is similar to converting to JSON, only objects (arrays, functions...) are not converted to string representation.

```js
const plain = utils.plain({
  date: new Date('2021-01-07T19:10:21.759Z'),
  prop: {
    _id: new ObjectId('6010a8c75b9b393070e42e68')
  }
});
```
Result (plain)
```
{
  date: '2021-01-07T19:10:21.759Z',
  prop: { 
    _id: '6010a8c75b9b393070e42e68' 
  }
}
```

### `utils.flat(value, path = '', separator = '.', clearUndefined = false)`

Converting a nested structure to a flat object.
Property names become path with `separator`.
To customize conversion, you can define the `[methods.toFlat]()` method in your object.

```js
const value = {
  a: {
    b: {
      c: 100
    }
  }
};
const flat = utils.flat(value, 'parent', '.');
```
Result (flat)
```
{
  'parent.a.b.c': 100
}
```

## License

Copyright © 2020, [VladimirShestakov](https://github.com/VladimirShestakov).
Released under the [MIT License](LICENSE).
