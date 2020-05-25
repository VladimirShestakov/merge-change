# merge-change

Deep merge objects and any other types with optionality doing change operations like `$set`, `$unset`, `$leave`.

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

#### `$set`

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


#### `$unset`

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

#### `$leave`

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
 ```json
 {
   "a": {
     "two": 2
   }
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
### .type(value): String

Get real type of any value

```js
console.log(utils.type(null)); // => 'Null'
console.log(utils.type(true)); // => 'Boolean'
console.log(utils.type(new ObjectId())); // => 'ObjectID'
...
```
 
## License

Copyright © 2020, [VladimirShestakov](https://github.com/VladimirShestakov).
Released under the [MIT License](LICENSE).
