/**
 * Utils for change object
 */
const utils = {
  unset: (obj, path, separator = '.') => {
    if (typeof path === 'number') {
      path = [path];
    }
    if (obj === null) {
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
  },

  get: (obj, path, defaultValue, separator = '.') => {
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
  },

  set: (obj, path, value, doNotReplace, separator = '.') => {
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
  },

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
    if (value && value.constructor){
      return value.constructor.name;
    } else {
      return Object.prototype.toString.call(value).slice(8, -1);
    }
  }
};

module.exports = utils;
