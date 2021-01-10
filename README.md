# merge-change

Simple library for deep merge of objects and other types (also for patch or immutable update) .
By default, merge works for "plain objects".
Values of other types are replaced, but you can customize merging between specific types.
Also, you can use declarative operations to specific merge like `unset`, `leave`, `push`.
For example to remove some properties, to replace "plain objects", to concat arrays.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save merge-change
```

## API

### Merge

Merge with deep cloning without changing the source objects. Great for creating or extending objects from the example (source).

```js
const result = mc.merge(source, ...values);
```
example
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

### Patch

Merge with mutation of the source objects. Nice for patching. New instances will not be created.

```js
const result = mc.patch(source, ...patches);
```
```js
console.log(result === source); // => true
```
### Update

Immutable merge - create new instances only if there are diffs (also in inner properties). Nice for state management.

```js
const result = mc.update(source, ...changes);
```

## Declarative operators

When merging objects, you can perform delete and replace properties at the same time.
For change result use declarative operations in second or next arguments. Supported in all merge methods.
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

You can declare function for merge custom types (or override default logic).

`mc.addons.merge{Type}{Type} = function(first, second, kind){...}`

- `{Type}` - type (constructor name) of the first and second values: `Number, String, Boolean, Object, Array, Date, RegExp, Function, Undefined, Null, Symbol, Set, Map` and other system and custom constructor names
- `first` - first value for merge
- `second` - second value for merge
- `kind` - name of merging method, such as "merge", "patch", "update". 

For example, if you always need to union arrays, you can declare method to merge array with array. 

```js
mc.addons.mergeArrayArray = function(first, second, kind){
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
