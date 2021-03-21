/**
 * Utils for change object
 */
const utils = {
  unset: (obj, path, separator = '.') => {
    if (obj && typeof obj.operation$unset === 'function'){
      return obj.operation$unset(path, separator);
    } else {
      if (typeof path === 'number') {
        path = [path];
      }
      if (obj === null || typeof obj === 'undefined') {
        return obj;
      }
      if (!path) {
        return obj;
      }
      if (typeof path === 'string') {
        return utils.unset(obj, utils.splitPath(path, separator));
      }

      const currentPath = path[0];

      if (path.length === 1) {
        if (Array.isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      } else {
        return utils.unset(obj[currentPath], path.slice(1));
      }
      return obj;
    }
  },

  get: (obj, path, defaultValue, separator = '.') => {
    if (obj && typeof obj.operation$get === 'function'){
      return obj.operation$get(path, defaultValue, separator);
    } else {
      if (typeof path === 'string') {
        path = utils.splitPath(path, separator);
      }
      if (typeof path === 'number') {
        path = [path];
      }
      if (typeof obj === 'undefined') {
        return defaultValue;
      }
      if (path.length === 0) {
        return obj;
      }
      return utils.get(obj[path[0]], path.slice(1), defaultValue);
    }
  },

  /**
   * Установка значения по пути. Если в obj путь не найден, то будут созданы соотв сойства
   * @param obj
   * @param path
   * @param value
   * @param doNotReplace
   * @param separator
   * @returns {*}
   */
  set: (obj, path, value, doNotReplace, separator = '.') => {
    if (obj && typeof obj.operation$set === 'function'){
      return obj.operation$set(path, value, doNotReplace, separator);
    } else {
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || !path.length) {
        return obj;
      }
      if (!Array.isArray(path)) {
        return utils.set(obj, utils.splitPath(path, separator), value, doNotReplace);
      }
      const currentPath = path[0];
      const currentValue = obj[currentPath];
      if (path.length === 1) {
        // Если последний элемент пути, то установка значения
        if (!doNotReplace || currentValue === void 0) {
          obj[currentPath] = value;
        }
        return currentValue;
      }
      // Если путь продолжается, а текущего элемента нет, то создаётся пустой объект
      if (currentValue === void 0) {
        // //check if we assume an array
        // if (typeof path[1] === 'number') {
        //   obj[currentPath] = [];
        // } else {
        obj[currentPath] = {};
        // }
      }
      return utils.set(obj[currentPath], path.slice(1), value, doNotReplace, separator);
    }
  },

  /**
   * Раздение пути на элементы массива с игнором (обрезкой) разделителя вначале и конце строки
   * @param path {string} Путь для разделения
   * @param separator {string} Разделитель, например слэш
   * @returns {(number|string)[]}
   */
  splitPath: (path, separator = '.') => {
    if (typeof path === 'string'){
      if (path.substr(0, separator.length) === separator){
        path = path.substr(separator.length);
      }
      if (path.substr(path.length - separator.length) === separator){
        path = path.substr(0, path.length - separator.length);
      }
      path = path.split(separator).map(name => {
        const index = Number(name);
        return !Number.isNaN(index) && index !== null ? index : name;
      })
    }
    return path;
  },

  equal: function(first, second){
    return first === second;
  },

  /**
   * Тип значения - название конструктора
   * Number, String, Boolean, Object, Array, Date, RegExp, Function, Symbol, Set, Map and other system and custom constructor names
   * @param value
   * @returns {string|*}
   */
  type: function (value) {
    if (value === null) {
      return 'Null';
    }
    if (typeof value === 'undefined'){
      return 'Undefined'
    }
    return Object.getPrototypeOf(value).constructor.name;
  },

  /**
   * Все типы значения по цепочке их наследования
   * @param value
   * @returns {Array<string>}
   */
  typeList(value){
    let result = [];
    if (value === null){
      result.push('Null');
    } else
    if (typeof value === 'undefined'){
      result.push('Undefined')
    } else {
      function getClass(value) {
        if (value && value.constructor) {
          result.push(value.constructor.name);
          getClass(Object.getPrototypeOf(value));
        }
      }
      getClass(Object.getPrototypeOf(value));
    }
    return result;
  },

  /**
   * Проверка принадлежности к классу по названию класса
   * @param value Значение для проверки
   * @param className Название типа  (типа, конструктора)
   * @returns {boolean}
   */
  instanceof(value, className){
    if (value === null){
      return className === 'Null';
    } else {
      function getClass(value) {
        if (value && value.constructor) {
          if (className === value.constructor.name){
            return true;
          }
          return getClass(Object.getPrototypeOf(value));
        } else {
          return false;
        }
      }
      return getClass(Object.getPrototypeOf(value));
    }
  },

  /**
   * Вычисление разницы, результатом является объект с операторами $set и $unset
   * @param source {*} Исходное значение
   * @param compare] {*} Сравниваемое (новое) значение
   * @param [ignore {Array<string>} Названия игнорируемых свойтсв
   * @param [separator] {String} разделитель в путях на вложенные свойства
   * @param [path] {String} Путь на текущее свойство в рекурсивной обработке
   * @param [result] {String} Возвращаемый результат в рекурсивной обработке. Не следует использовать.
   * @returns {{$unset: [], $set: {}}}
   */
  diff: (source, compare, ignore = [], separator = '.', path = '', result) => {
    if (!result) {
      result = {$set: {}, $unset: []};
    }
    // Это не JSON.stringify! Вызываем метод, который даёт значение на конвертацию в JSON, но конвертация не выполняется
    // Типы свойств остаются исходными, но при этом можем сравнить внутренности кастомных объектов
    const sourcePlain = source && typeof source.toJSON === 'function' ? source.toJSON(): source;
    const comparePlain = compare && typeof compare.toJSON === 'function' ? compare.toJSON(): compare;

    const sourceType = utils.type(sourcePlain);
    const compareType = utils.type(comparePlain);
    if (sourceType === compareType && sourceType === 'Object'){
      const sourceKeys = Object.keys(sourcePlain);
      const compareKeys = Object.keys(comparePlain);
      // set property
      for (const key of compareKeys){
        const p = path ? path + separator + key : key;
        if (!ignore.includes(p)) {
          // new property
          if (!(key in sourcePlain)) {
            result.$set[p] = comparePlain[key];
          } else
            // change property
          if (comparePlain[key] !== sourcePlain[key]) {
            utils.diff(sourcePlain[key], comparePlain[key], ignore, separator, p, result);
          }
        }
      }
      // unset property
      for (const key of sourceKeys){
        if (!(key in comparePlain)){
          const p = path ? path + separator + key : key;
          if (!ignore.includes(p)) {
            result.$unset.push(p);
          }
        }
      }
    } else {
      if (!path) {
        result = compare;
      } else {
        if (!ignore.includes(path)) {
          result.$set[path] = compare;
        }
      }
    }
    return result;
  },

  /**
   * Конвертирует структуру данных через рекурсивный вызов методов toPlainMethod или toJSON если они есть у каждого значения.
   * Если метода нет, возвращается исходное значение
   * Значения для которых нет метода call останутся в исходном значении.
   * @param value {*} Значение для конвертации
   * @returns {*}
   */
  toPlain(value){
    if (value === null || typeof value === 'undefined') {
      return value;
    }
    if (typeof value[utils.toPlainMethod] === 'function') {
      value = value[utils.toPlainMethod]();
    } else
    if (typeof value.toJSON === 'function') {
      value = value.toJSON();
    } else {
      //value = value.valueOf();
    }
    if (Array.isArray(value)){
      return value.map(item => utils.toPlain(item));
    } else
    if (utils.type(value) === 'Object'){
      let result = {};
      for (const [key, item] of Object.entries(value)) {
        result[key] =  utils.toPlain(item);
      }
      return result;
    }
    return value;
  },

  /**
   * Конвертация вложенной структуры в плоскую
   * Названия свойств превращаются в путь {a: {b: 0}}  => {'a.b': 0}
   * @param value {object|*} Исходный объекты для конвертации
   * @param [path] {string} Базовый путь для формирования ключей плоского объекта. Используется для рекурсии.
   * @param [separator] {string} Разделитель для названий ключей плоского объекта
   * @param [clearUndefined] {boolean} Признак, добавлять ли в результат неопределенные значения
   * @param [result] {object} Результат - плоский объект. Передаётся по ссылки для рекурсии
   * @returns {{}}
   */
  toFlat: (value, path = '', separator = '.', clearUndefined = false, result = {}) => {
    if (value && typeof value[utils.toFlatMethod] === 'function') {
      value[utils.toFlatMethod](path, separator, clearUndefined, result);
    } else if (utils.type(value) === 'Object') {
      for (const [key, item] of Object.entries(value)) {
        utils.toFlat(item, path ? `${path}${separator}${key}` : key, separator, clearUndefined, result);
      }
    } else if (!clearUndefined || typeof value !== 'undefined') {
      if (path === '') {
        result = value;
      } else {
        result[path] = value;
      }
    }
    return result;
  },
  /**
   * Название метода для кастомизации toPlain
   */
  toPlainMethod: Symbol('toPlain'),
  /**
   * Название метода для кастомизации toFlat
   */
  toFlatMethod: Symbol('toFlat'),
};

module.exports = utils;
