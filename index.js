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
      return objectUtils.set(obj, path.split('.'), value, doNotReplace);
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

  leave: (object, paths) => {
    let result = {};
    for (let path of paths) {
      utils.set(result, path, utils.get(object, path));
    }
    return result;
  },

  pull: (object, fields) => {
    const paths = Object.keys(fields);
    for (const path of paths) {
      const cond = fields[path];
      const array = utils.get(object, path, []);
      if (Array.isArray(array)) {
        utils.set(object, path, array.filter(value => {
          return !isEqual(cond, value);
        }));
      } else {
        throw new Error('Cannot pull on not array');
      }
    }
    return object;
  },

  push: (object, fields) => {
    const paths = Object.keys(fields);
    for (const path of paths) {
      const value = fields[path];
      const array = utils.get(object, path, []);
      //console.log(path, array);
      if (Array.isArray(array)) {
        array.push(value);
        utils.set(object, path, array);
      } else {
        throw new Error('Cannot push on not array');
      }
    }
    return object;
  },
};

function merge(...args){

}

merge.canMerge = (object) => {
  return true;
};

merge.mergeArray = (first, second) => {
  return [...second];
};

module.exports = merge;
