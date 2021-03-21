/**
 * Method methods for extend
 */
const methods = {
  /**
   * Название метода для кастомизации plain
   */
  toPlain: Symbol('toPlain'),
  /**
   * Название метода для кастомизации toFlat
   */
  toFlat: Symbol('toFlat'),
  /**
   * Название метода, который вернет внутренне значение для операций над ним. Для обработки методов set, unset, leave и других в кастомных объектах
   */
  toOperation: Symbol('toOperation'),
};

module.exports = methods;
