const utils = require('./utils.js');

const MODES = {
  MERGE: 'merge',
  PATCH: 'patch',
  UPDATE: 'update'
}

function MergeChange() {
  return this;
}

/**
 * Пользовательские переопредления методов слияния
 * @type {{}}
 */
MergeChange.prototype.addons = {};

/**
 * Фабрика методов слияния
 * Замыкание на режим слияния, чтобы обрабатывать любое количество значений
 * @param mode {String} Режимы слияния MODES
 */
MergeChange.prototype.prepareMerge = function(mode) {
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
            return this[action](first, second, mode);
          }
        }
        return first;
      }
    );
  }
}

/**
 * Создание полностью нового объекта слиянием базового объекта и модификаций.
 * Переданные объекты не мутируются.
 * Можно использовать для клонирования.
 * @type {function(...values)}
 */
MergeChange.prototype.merge = MergeChange.prototype.prepareMerge(MODES.MERGE);

/**
 * Мутабельное слияние модификаций в базовый объект и его возврат.
 * Гарантируется сохранение ссылочных связей.
 * Происходит мутирование переданных значений кроме последнего.
 * @type {function(...values)}
 */
MergeChange.prototype.patch = MergeChange.prototype.prepareMerge(MODES.PATCH);

/**
 * Немутабельное слияение.
 * Если есть изменения, то возвращется новый объект. Если изменений нет, то возвращается базовый объект.
 * Правило работает на всех уровнях вложенности.
 * @type {function(...values)}
 */
MergeChange.prototype.update = MergeChange.prototype.prepareMerge(MODES.UPDATE);

/**
 * Слияние любых значений.
 * По сути отсутсвие слияние, так как неизвестно как его делать.
 * Возвращается всегда новое значение взамен текущему.
 * В режиме MERGE значение нужно склонировать.
 * @param first
 * @param second
 * @param mode
 * @returns {*}
 */
MergeChange.prototype.mergeAnyAny = function(first, second, mode){
  if (this.addons.mergeAnyAny){
    return this.addons.mergeAnyAny(first, second, mode)
  }
  return this[mode](undefined, second);
}

/**
 * Слияние неопредленного типа с объектом.
 * Само слияние не выполняется, но в объекте могут быть указаны операции над значением - они выполняются
 * @param first
 * @param second
 * @param mode
 * @returns {*}
 */
// MergeChange.prototype.mergeAnyObject = function(first, second, mode){
//   if (this.addons.mergeAnyObject){
//     return this.addons.mergeAnyObject(first, second, mode)
//   }
//   return this[mode](undefined, second);
// }

/**
 * Слияние значения неизвестного типа с несуществующим значением.
 * По факту возвращается текущее значение. Но в режиме MERGE его нужно склонировать
 * @param first
 * @param second
 * @param mode
 * @returns {*}
 */
MergeChange.prototype.mergeAnyUndefined = function(first, second, mode){
  if (this.addons.mergeAnyUndefined){
    return this.addons.mergeAnyUndefined(first, second, mode)
  }
  return this[mode](undefined, first);
}

/**
 * Слияние любого нового значение к несуществующему.
 * Всегда возвращается новое значение.
 * В режиме MERGE значение нужно клонировать, но так как нет конкретики про тип - клонирование не выполняется.
 * Для реализации режима MERGE нужно определять методы на конкретный тип .mergeUndefined<type>()
 * @param first
 * @param second
 * @param mode
 * @returns {*}
 */
MergeChange.prototype.mergeUndefinedAny = function(first, second, mode){
  if (this.addons.mergeUndefinedAny){
    return this.addons.mergeUndefinedAny(first, second, mode)
  }
  return second;
}

/**
 * Слияние даты к несуществующему значению.
 * В режиме MERGE создаётся новый экземпляр даты
 * @param first
 * @param second
 * @param mode
 * @returns {Date}
 */
MergeChange.prototype.mergeUndefinedDate = function(first, second, mode){
  if (this.addons.mergeUndefinedDate){
    return this.addons.mergeUndefinedDate(first, second, mode)
  }
  return mode ===  MODES.MERGE ? new Date(second) : second;
}

/**
 * Слияние Set к несуществующему значению.
 * В режиме MERGE клонируется экземпляр Set
 * @param first
 * @param second
 * @param mode
 * @returns {Set}
 */
MergeChange.prototype.mergeUndefinedSet = function(first, second, mode){
  if (this.addons.mergeUndefinedSet){
    return this.addons.mergeUndefinedSet(first, second, mode)
  }
  return mode ===  MODES.MERGE ? new Set(second) : second;
}

/**
 * Слияние Map к несуществующему значению.
 * В режиме MERGE клонируется экземпляр Map
 * @param first
 * @param second
 * @param mode
 * @returns {Map}
 */
MergeChange.prototype.mergeUndefinedMap = function(first, second, mode){
  if (this.addons.mergeUndefinedMap){
    return this.addons.mergeUndefinedMap(first, second, mode)
  }
  return mode ===  MODES.MERGE ? new Map(second) : second;
}

/**
 * Слияние WeekSet к несуществующему значению.
 * В режиме MERGE клонируется экземпляр WeekSet
 * @param first
 * @param second
 * @param mode
 * @returns {WeekSet}
 */
MergeChange.prototype.mergeUndefinedWeekSet = function(first, second, mode) {
  if (this.addons.mergeUndefinedWeekSet){
    return this.addons.mergeUndefinedWeekSet(first, second, mode)
  }
  return mode === MODES.MERGE ? new WeakSet(second) : second;
}

/**
 * Слияние WeekMap к несуществующему значению.
 * В режиме MERGE клонируется экземпляр WeekMap
 * @param first
 * @param second
 * @param mode
 * @returns {WeekMap}
 */
MergeChange.prototype.mergeUndefinedWeekMap = function(first, second, mode){
  if (this.addons.mergeUndefinedWeekMap){
    return this.addons.mergeUndefinedWeekMap(first, second, mode)
  }
  return mode ===  MODES.MERGE ? new WeakMap(second) : second;
}

/**
 * Слияние массива к несуществующему значению.
 * В режиме MERGE клонируется экземпляр массима
 * @param first
 * @param second
 * @param mode
 * @returns {Array}
 */
MergeChange.prototype.mergeUndefinedArray = function(first, second, mode){
  if (this.addons.mergeUndefinedArray){
    return this.addons.mergeUndefinedArray(first, second, mode)
  }
  return mode ===  MODES.MERGE ? this.mergeArrayArray([], second, mode) : second;
}

/**
 * Слияние объекта к несуществующему значению.
 * Также выполняются оперции, если они есть в second
 * В режиме MERGE клонируется экземпляр объекта
 * @param first
 * @param second
 * @param mode
 * @returns {Object}
 */
MergeChange.prototype.mergeUndefinedObject = function(first, second, mode){
  if (this.addons.mergeUndefinedObject){
    return this.addons.mergeUndefinedObject(first, second, mode)
  }
  return mode ===  MODES.MERGE ? this.mergeObjectObject({}, second, mode) : second;
}

/**
 * Слияние объекта с объектом.
 * Также выполняются оперции, если они есть в second
 * @param first
 * @param second
 * @param mode
 * @returns {Object}
 */
MergeChange.prototype.mergeObjectObject = function(first, second, mode){
  if (this.addons.mergeObjectObject){
    return this.addons.mergeObjectObject(first, second, mode)
  }
  let result = mode === MODES.PATCH ? first : {};
  let resultField;
  let isChange = mode === MODES.MERGE;
  let operations = [];
  const keysFirst = Object.keys(first);
  const keysSecond = new Set(Object.keys(second));
  for (const key of keysFirst){
    if (key in second){
      resultField = this[mode](first[key], second[key]);
      keysSecond.delete(key);
    } else {
      resultField = this[mode](first[key], undefined);
    }
    isChange = isChange || resultField !== first[key];
    result[key] = resultField;
  }
  for (const key of keysSecond){
    if (this.isOperation(key)){
      operations.push([key, second[key]]);
    } else {
      resultField = this[mode](undefined, second[key]);
      isChange = isChange || resultField !== first[key];
      result[key] = resultField;
    }
  }
  for (const [operation, params] of operations){
    isChange = this.operation(result, operation, params);
  }
  return isChange ? result : first;
}

/**
 * Слияние массива с массивом.
 * По умочланию возвращается второй массив
 * @param first
 * @param second
 * @param mode
 * @returns {Array}
 */
MergeChange.prototype.mergeArrayArray = function(first, second, mode){
  if (this.addons.mergeArrayArray){
    return this.addons.mergeArrayArray(first, second, mode)
  }
  if (mode === MODES.MERGE){
    return second.map(item => this[mode](undefined, item));
  }
  return second;
}

MergeChange.prototype.isOperation = function(operation, params){
  return Boolean(this[`operation${operation}`]);
}

MergeChange.prototype.operation = function(source, operation, params){
  const method = `operation${operation}`;
  if (this[method]){
    return this[method](source, params);
  }
}

/**
 * Установка свойств объекту или замена элементов массива
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
 * Удаление свойств объекта или элементов массива.
 * @param source
 * @param params Массив путей на удаляемые свойства. Учитывается вложенность
 * @returns {boolean}
 */
MergeChange.prototype.operation$unset = function(source, params){
  if (Array.isArray(params)){
    // перечень полей для удаления
    for (const fieldName of params) {
      utils.unset(source, fieldName);
    }
    return params.length > 0;
  }
  return false;
}

/**
 * Удаление всех свойств или элементов за исключением указанных
 * @param source
 * @param params Массив свойств, которые не надо удалять
 * @returns {boolean}
 */
MergeChange.prototype.operation$leave = function(source, params){
  if (Array.isArray(params)){
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
 * Удаление элементов по равенству значения
 * @param source
 * @param params
 * @returns {boolean}
 */
MergeChange.prototype.operation$pull = function(source, params){
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
 * Добавление элемента
 * @param source
 * @param params
 * @returns {boolean}
 */
MergeChange.prototype.operation$push = function(source, params) {
  const paths = Object.keys(params);
  for (const path of paths) {
    const value = params[path];
    const array = this.get(source, path, []);
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
 * Вычисление разницы между объектами.
 * Возвращается объект модификаций
 * @param prevObject
 * @param newObject
 */
MergeChange.prototype.diff = function(prevObject, newObject){

}

MergeChange.prototype.instance = function(){
  return new this.constructor();
}

// MergeChange.prototype.addons = function(callback){
//   callback(MergeChange.prototype.addons);
// }
//
// MergeChange.prototype.addons = function(callback){
//   callback(MergeChange.prototype.addons);
// }

module.exports = new MergeChange();
