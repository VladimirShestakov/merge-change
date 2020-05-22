# merge-change

Deep merge two or more objects (and any other types) with optionality doing change operations like `$set`, `$unset`, `$leave`.

Merging can be of three modes:
- `mc.merge()` merge with deep cloning without changing the sources objects. Great for creating or expanding objects from etalon.
- `mc.patch()` merge with mutation of the source objects. Nice for patchig. New instances will not creating.
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

## Configure

You can declare function for merge custom types (or override default logic).

`mc.addons.merge<Type><Type> = function(first, second, mode){}`

`<Type> - Number, String, Boolean, Object, Array, Date, RegExp, Function, Undefined, Null, Symbol, Set, Map and other system and custom constructor names`
 
For example, if you need union array, you can declare custom function for merge array with array. 
Default the first array is replaced by the second.

```
mc.addons.mergeArrayArray = function(first, second, mode){
  return [...first, ...second]
};
```

## Merge methods


### Merge

Deep merge two or more object. Creating new object.

```
const result = mc.merge(object1, object2, object3, ...);
```

### Patch

Merge with mutation of the source objects. Nice for patchig. New instances will not creating.

```
const result = mc.patch(object1, object2, object3, ...);
```

### Update

Merge without mutations (immutable) - create new instances only if have changes. Nice for state management (redux reducers)

```
const result = mc.update(object1, object2, object3, ...);
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

## Utils

```js
const utils = require('merge-change').utils;
```
### .type(value): String

Get real type of any value

```
console.log(utils.type(null)) => 'Null'
console.log(utils.type(true)) => 'Boolean'
console.log(utils.type(new ObjectId())) => 'ObjectID'
...
```
 
## License

Copyright © 2020, [VladimirShestakov](https://github.com/VladimirShestakov).
Released under the [MIT License](LICENSE).
