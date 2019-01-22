# merge-change
Deep merge two or more objects and optinality doing change operations like `$set`, `$unset`, `$leave`, `$pull`, `$push`

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

### License

Copyright © 2018, [VladimirShestakov](https://github.com/VladimirShestakov).
Released under the [MIT License](LICENSE).
