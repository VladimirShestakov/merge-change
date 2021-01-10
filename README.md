# merge-change

Deep merge/patch/update objects and any other types. With declarative operations for specific changes like `unset`, `leave`, `push`.
By default merge working for "plain objects". Values of other types are replaced. But you can customize merging between specific types.

Merging can be of three modes:
- `mc.merge()` merge with deep cloning without changing the sources objects. Great for creating or extending objects from the etalon.
- `mc.patch()` merge with mutation of the source objects. Nice for patching. New instances will not create.
- `mc.update()` immutable merge - create new instances only if have changes. Nice for state management.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save merge-change
```

## Usage

```js
const mc = require('merge-change');

// Create new object with adding "a.three" and deleting "a.one"
const result = mc.merge(
  { a: {one: true, two: 2} }, 
  { a: {three: 3, $unset: 'one'} }
);

console.log(result);
//=> { a: { two: 2,  three: 3} }
```

## Merge methods


### Merge

Deep merge two or more values. Creating new instance with deep cloning.

```js
const result = mc.merge(value1, value2, ...values);
```

### Patch

Merge with mutation of the target values. Nice for patching. New instances will not creating.

```js
const result = mc.patch(target, patch1, ...patches);
```
```js
console.log(result === target); // => true
```
### Update

Merge without mutations (immutable) - create new instances only if have changes. Nice for state management (redux reducers)

```js
const result = mc.update(source, change1, ...changes);
```

## Change operators

When merging objects, you can perform delete and replace properties at the same time.
For change result use declarative operations in second or next arguments. Supported in all merge methods (modes).
The syntax is similar to mongodb.

### `$set`

Set attribute without union with some attribute in preview objects or array elements.
Fields keys can be path for nested.

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
      'a.two': 20
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

Unset attribute in preview objects by name (or path)

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

Leave attribute in preview objects by name (or path)

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

Push one value to source array

The source property (in first object) must be an array.

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

Merge arrays.

The source property (in first object) must be an array. Merges can be an array or any other type.

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


## Configure

You can declare function for merge custom types (or override default logic).

`mc.addons.merge<Type><Type> = function(first, second, mode){}`

- `<Type>` - type of the first and second values: `Number, String, Boolean, Object, Array, Date, RegExp, Function, Undefined, Null, Symbol, Set, Map` and other system and custom constructor names
- `first` - first value for merge
- `second` - second value for merge
- `mode` - name of merging method, such as "merge", "patch", "update". 
 
For example, if you need to union arrays, you can declare custom function for merge array with array. 
By default, the not object value replacing by the second value (only objects will be merging).

```js
mc.addons.mergeArrayArray = function(first, second, mode){
  // merge mode - creaete new array with deep clone
  if (mode === 'merge'){
    return first.concat(second).map(item => mc.merge(undefined, item));
  }
  // patch mode - mutate first array
  if (mode === 'patch'){
    first.splice(first.length, 0, ...second);
    return first;
  }
  // update mode - return first array if second is empty, or create new without clone
  if (second.length === 0){
    return first;
  } else {
    return first.concat(second);
  }
};
```

## Utils

```js
const utils = require('merge-change').utils;
```
### .type(value:any): string

Get real type of any value

```js
utils.type(null); // => 'Null'
utils.type(true); // => 'Boolean'
utils.type(new ObjectId()); // => 'ObjectID'
```

### .instanceof(value:any, className: string): boolean

Checking instance of class. className is string (not constructor)

```js
utils.instanceof(100, 'Number'); // => true
utils.instanceof(new MyClass(), 'MyClass'); // => true
utils.instanceof(new MyClass(), 'Object'); // => true
```
 
...see other utils in source [utils.js](./utils.js)

## License

Copyright © 2020, [VladimirShestakov](https://github.com/VladimirShestakov).
Released under the [MIT License](LICENSE).
