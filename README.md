# merge-change
Deep merge two or more objects and optionality doing change operations like `$set`, `$unset`, `$leave`, `$pull`, `$push`

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save merge-change
```

## Usage

```js
const mc = require('merge-change');
const result = mc(
  {a: {one: true, two: 2}}, 
  {a: {three: 3, $unset: 'one'}}
);
console.log(result);
//=> { a: { two: 2,  three: 3} }
```

### Configure

#### `.canMerge(object)`

Declare function for check, do or not to do merge. By default not merge Data, Regex, Null.

#### `.mergeArray(first, second)`

If you need merge array (union), you can declare custom merge function for arrays. By default 
array resets.

### Merge

Deep merge two or more object. Create new object.

```
const result = mc(object1, object2, object3);
```

### Clone

Deep clone with one arguments

```
const result = mc(object);
```

### Change

For change result use declarative operations in second or next arguments. Operation can
combine with object attributes. Syntax like mongodb.

#### `$set`

Set attribute without union with some attribute in preview objects

```js
const result = mc(
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
      }
    }
  }
);
console.log(result);
```
```json
{
  "a": {
    "three": 3
  }
}
```

#### `$unset`

Unset attribute in preview objects by name (or path)

 ```js
 const result = mc(
   {
     a: {
       one: 1, 
       two: 2
     }
   }, 
   {
     a: {
       $unset: ['two']
     }
   }
 );
 console.log(result);
 ```
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
 
#### `$pull`

Pull elements from array attribute

#### `$push`

Push elements to array attribute


### License

Copyright © 2018, [VladimirShestakov](https://github.com/VladimirShestakov).
Released under the [MIT License](LICENSE).
