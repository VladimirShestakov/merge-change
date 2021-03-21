const utils = require('./utils.js');
const methods = require('./methods.js');

/**
 * Module will export single instance of MergeChange
 * @returns {MergeChange}
 * @constructor
 */
function MergeChange() {
  return this;
}

/**
 * Kinds of merge method
 * @type {{MERGE: string, UPDATE: string, PATCH: string}}
 */
MergeChange.KINDS = {
  MERGE: 'merge', // cloning
  PATCH: 'patch', // change in source value
  UPDATE: 'update' //immutable update (new value if there are diffs)
}

/**
 * Factory method. Looks for suitable methods for type merging
 * Closure on merge kind to handle any number of values
 * @param kind {String} Kind of merge from KINDS
 */
MergeChange.prototype.prepareMerge = function(kind) {
  return (...values) => {
    return values.reduce((first, second) => {
        const firstType = utils.type(first);
        const secondType = utils.type(second);
        const actions = [
          `merge${firstType}${secondType}`,
          `merge${firstType}Any`,
          `mergeAny${secondType}`,
          `mergeAnyAny`,
        ]
        for (const action of actions) {
          if (this[action]) {
            return this[action](first, second, kind);
          }
        }
        return first;
      }
    );
  }
}

/**
 * Merge with cloning
 * Переданные объекты не мутируются.
 * Можно использовать для клонирования.
 * @type {function(...values)}
 */
MergeChange.prototype.merge = MergeChange.prototype.prepareMerge(MergeChange.KINDS.MERGE);

/**
 * Merging patches
 * Гарантируется сохранение ссылочных связей.
 * Происходит мутирование переданных значений кроме последнего.
 * @type {function(...values)}
 */
MergeChange.prototype.patch = MergeChange.prototype.prepareMerge(MergeChange.KINDS.PATCH);

/**
 * Immutable merge
 * Если есть изменения, то возвращется новый объект. Если изменений нет, то возвращается базовый объект.
 * Правило работает на всех уровнях вложенности.
 * @type {function(...values)}
 */
MergeChange.prototype.update = MergeChange.prototype.prepareMerge(MergeChange.KINDS.UPDATE);

/**
 * Merge Any with Any
 * No merge required
 * @todo On kind "merge" we need cloning first argument?
 * По сути отсутсвие слияние, так как неизвестно как его делать.
 * Возвращается всегда новое значение взамен текущему.
 * В режиме MERGE значение нужно склонировать.
 * @param first
 * @param second
 * @param kind
 * @returns {*}
 */
MergeChange.prototype.mergeAnyAny = function(first, second, kind){
  return this[kind](undefined, second);
}

/**
 * Merge Any with plain object
 * @todo No merge required, but may need to do declarative operations?
 * @param first
 * @param second
 * @param kind
 * @returns {*}
 */
// MergeChange.prototype.mergeAnyObject = function(first, second, kind){
//   return this[kind](undefined, second);
// }

/**
 * Merge Any with undefined
 * @todo On kind "merge" we need cloning first argument.
 * @param first
 * @param second
 * @param kind
 * @returns {*}
 */
MergeChange.prototype.mergeAnyUndefined = function(first, second, kind){
  return this[kind](undefined, first);
}

/**
 * Merge undefined with any types.
 * Always return second value
 * @todo On kind "merge" we need cloning second argument.
 * В режиме MERGE значение нужно клонировать, но так как нет конкретики про тип - клонирование не выполняется.
 * Для реализации режима MERGE нужно определять методы на конкретный тип .mergeUndefined<type>()
 * @param first
 * @param second
 * @param kind
 * @returns {*}
 */
MergeChange.prototype.mergeUndefinedAny = function(first, second, kind){
  return second;
}

/**
 * Merge undefined with Date
 * В режиме MERGE создаётся новый экземпляр даты
 * @param first
 * @param second
 * @param kind
 * @returns {Date}
 */
MergeChange.prototype.mergeUndefinedDate = function(first, second, kind){
  return kind ===  MergeChange.KINDS.MERGE ? new Date(second) : second;
}

/**
 * Merge undefined with Set
 * В режиме MERGE клонируется экземпляр Set
 * @param first
 * @param second
 * @param kind
 * @returns {Set}
 */
MergeChange.prototype.mergeUndefinedSet = function(first, second, kind){
  return kind ===  MergeChange.KINDS.MERGE ? new Set(second) : second;
}

/**
 * Merge undefined with Map
 * В режиме MERGE клонируется экземпляр Map
 * @param first
 * @param second
 * @param kind
 * @returns {Map}
 */
MergeChange.prototype.mergeUndefinedMap = function(first, second, kind){
  return kind ===  MergeChange.KINDS.MERGE ? new Map(second) : second;
}

/**
 * Merge undefined with WeekSet
 * В режиме MERGE клонируется экземпляр WeekSet
 * @param first
 * @param second
 * @param kind
 * @returns {WeekSet}
 */
MergeChange.prototype.mergeUndefinedWeekSet = function(first, second, kind) {
  return kind === MergeChange.MERGE ? new WeakSet(second) : second;
}

/**
 * Merge undefined with WeekMap
 * В режиме MERGE клонируется экземпляр WeekMap
 * @param first
 * @param second
 * @param kind
 * @returns {WeekMap}
 */
MergeChange.prototype.mergeUndefinedWeekMap = function(first, second, kind){
  return kind ===  MergeChange.KINDS.MERGE ? new WeakMap(second) : second;
}

/**
 * Merge undefined with array
 * В режиме MERGE клонируется экземпляр массима
 * @param first
 * @param second
 * @param kind
 * @returns {Array}
 */
MergeChange.prototype.mergeUndefinedArray = function(first, second, kind){
  return kind ===  MergeChange.KINDS.MERGE ? this.mergeArrayArray([], second, kind) : second;
}

/**
 * Merge undefined with plain object
 * Также выполняются операции, если они есть в second
 * В режиме MERGE клонируются экземпляр объекта
 * @param first
 * @param second
 * @param kind
 * @returns {Object}
 */
MergeChange.prototype.mergeUndefinedObject = function(first, second, kind){
  return kind ===  MergeChange.KINDS.MERGE ? this.mergeObjectObject({}, second, kind) : second;
}

/**
 * Merge plain object with plain object
 * @param first
 * @param second
 * @param kind
 * @returns {Object}
 */
MergeChange.prototype.mergeObjectObject = function(first, second, kind){
  let result = kind === MergeChange.KINDS.PATCH ? first : {};
  let resultField;
  let isChange = kind === MergeChange.KINDS.MERGE;
  let operations = [];
  const keysFirst = Object.keys(first);
  const keysSecond = new Set(Object.keys(second));
  for (const key of keysFirst){
    if (key in second){
      resultField = this[kind](first[key], second[key]);
      keysSecond.delete(key);
    } else {
      resultField = this[kind](first[key], undefined);
    }
    isChange = isChange || resultField !== first[key];
    result[key] = resultField;
  }
  // find declarative operations
  for (const key of keysSecond){
    if (this.isOperation(key)){
      operations.push([key, second[key]]);
    } else {
      resultField = this[kind](undefined, second[key]);
      isChange = isChange || resultField !== first[key];
      result[key] = resultField;
    }
  }
  // execute declarative operations
  for (const [operation, params] of operations){
    isChange = this.operation(result, operation, params);
  }
  return isChange ? result : first;
}

/**
 * Merge array with array
 * Replace arrays - return second argument.
 * On kind "merge" we cloning second argument.
 * @param first
 * @param second
 * @param kind
 * @returns {Array}
 */
MergeChange.prototype.mergeArrayArray = function(first, second, kind){
  if (kind === MergeChange.KINDS.MERGE){
    return second.map(item => this[kind](undefined, item));
  }
  return second;
}

/**
 * Checking if a declarative operation exists
 * @param operation
 * @param [params]
 * @returns {boolean}
 */
MergeChange.prototype.isOperation = function(operation, params){
  return Boolean(this[`operation${operation}`]);
}

/**
 * Execute declarative operation
 * @param source
 * @param operation
 * @param params
 * @returns {*}
 */
MergeChange.prototype.operation = function(source, operation, params){
  const method = `operation${operation}`;
  if (this[method]){
    return this[method](source, params);
  }
}

/**
 * $set
 * @param source
 * @param params Объект со свойствами, которые нужно добавить без слияния. Ключи свойств могут быть путями с учётом вложенности
 * @returns {boolean}
 */
MergeChange.prototype.operation$set = function(source, params){
  const fieldNames = Object.keys(params);
  for (const fieldName of fieldNames) {
    utils.set(source, fieldName, params[fieldName]);
  }
  return fieldNames.length > 0;
}

/**
 * $unset
 * Удаление свойств объекта или элементов массива.
 * @param source
 * @param params Массив путей на удаляемые свойства. Учитывается вложенность
 * @returns {boolean}
 */
MergeChange.prototype.operation$unset = function(source, params){
  if (Array.isArray(params)){
    // Перечень полей для удаления
    for (const fieldName of params) {
      utils.unset(source, fieldName);
    }
    return params.length > 0;
  }
  return false;
}

/**
 * $leave
 * Удаление всех свойств или элементов за исключением указанных
 * @param source
 * @param params Массив свойств, которые не надо удалять
 * @returns {boolean}
 */
MergeChange.prototype.operation$leave = function(source, params){
  if (Array.isArray(params)){
    if (source && typeof source[methods.toOperation] === 'function') {
      source = source[methods.toOperation]();
    } else if (source && typeof source.toJSON === 'function') {
      source = source.toJSON();
    }
    const names = {};
    for (const param of params){
      let name = param;
      let subPath = '';
      if (typeof param === 'string'){
        [name, subPath] = param.split('.');
      }
      if (!names[name]){
        names[name] = [];
      }
      if (subPath){
        names[name].push(subPath);
      }
    }
    const type = utils.type(source);
    if (type === 'Object'){
      const keys = Object.keys(source);
      for (const key of keys){
        if (!names[key]){
          delete source[key];
        } else
        if (names[key].length > 0){
          this.operation$leave(source[key], names[key]);
        }
      }
    } else
    if (type === 'Array'){
      for (let key=source.length - 1; key>=0; key--){
        if (!(key in names)){
          source.splice(key, 1);
        }
      }
    }
    return params.length > 0;
  }
  return false;
}

/**
 * $pull
 * Удаление элементов по равенству значения
 * @param source
 * @param params
 * @returns {boolean}
 */
MergeChange.prototype.operation$pull = function(source, params){
  if (source && typeof source[methods.toOperation] === 'function') {
    source = source[methods.toOperation]();
  } else if (source && typeof source.toJSON === 'function') {
    source = source.toJSON();
  }
  const paths = Object.keys(params);
  for (const path of paths) {
    const cond = params[path];
    const array = utils.get(source, path, []);
    if (Array.isArray(array)) {
      for (let i=array.length - 1; i>=0; i--){
        if (utils.equal(cond, array[i])){
          source.splice(i, 1);
        }
      }
    } else {
      throw new Error('Cannot pull on not array');
    }
  }
  return paths.length > 0;
}

/**
 * $push
 * Добавление элемента
 * @param source
 * @param params
 * @returns {boolean}
 */
MergeChange.prototype.operation$push = function(source, params) {
  if (source && typeof source[methods.toOperation] === 'function') {
    source = source[methods.toOperation]();
  } else if (source && typeof source.toJSON === 'function') {
    source = source.toJSON();
  }
  const paths = Object.keys(params);
  for (const path of paths) {
    const value = params[path];
    const array = utils.get(source, path, []);
    if (Array.isArray(array)) {
      array.push(value);
      utils.set(source, path, array);
    } else {
      throw new Error('Cannot push on not array');
    }
  }
  return paths.length > 0;
}

/**
 * $concat
 * Слияние элементов массива
 * @param source
 * @param params
 * @returns {boolean}
 */
MergeChange.prototype.operation$concat = function(source, params) {
  if (source && typeof source[methods.toOperation] === 'function') {
    source = source[methods.toOperation]();
  } else if (source && typeof source.toJSON === 'function') {
    source = source.toJSON();
  }
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
}

/**
 * Add custom merge method
 * @param type1 {String} Type of source value
 * @param type2 {String} Type of secondary value
 * @param callback {Function} Merge function with argument: (first, second, kind)
 * @returns {*} The previous merge method
 */
MergeChange.prototype.addMerge = function(type1, type2, callback){
  const method = `merge${type1}${type2}`;
  const current = MergeChange.prototype[method];
  MergeChange.prototype[method] = callback;
  return current
}

/**
 * Add custom declarative operation
 * @param name {String} Operation name
 * @param callback {Function} Operation function with argument: (source, params)
 * @returns {*} The previous operation method
 */
MergeChange.prototype.addOperation = function(name, callback){
  if (name.substr(0,1)!=='$'){
    name = '$' + name;
  }
  const method = `operation${name}`;
  const current = MergeChange.prototype[method];
  MergeChange.prototype[method] = callback;
  return current
}

module.exports = new MergeChange();
