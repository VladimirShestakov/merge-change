/**
 * Utils for change object
 */
const utils = {
  unset: (obj, path) => {
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
      return utils.unset(obj, path.split('.'));
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

  get: (obj, path, defaultValue) => {
    if (typeof path === 'string') {
      path = path.split('.');
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

  set: (obj, path, value, doNotReplace) => {
    if (typeof path === 'number') {
      path = [path];
    }
    if (!path || path.length === 0) {
      return obj;
    }
    if (typeof path === 'string') {
      return utils.set(obj, path.split('.'), value, doNotReplace);
    }
    const currentPath = path[0];
    const currentValue = obj[currentPath];
    if (path.length === 1) {
      if (currentValue === void 0 || !doNotReplace) {
        obj[currentPath] = value;
      }
      return currentValue;
    }

    if (currentValue === void 0) {
      //check if we assume an array
      if (typeof path[1] === 'number') {
        obj[currentPath] = [];
      } else {
        obj[currentPath] = {};
      }
    }

    return utils.set(obj[currentPath], path.slice(1), value, doNotReplace);
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
