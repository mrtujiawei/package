/**
 * 类型相关的操作
 */
import { toString } from '../utils/topLevelUtils';

class Types {
  /**
   * 原始类型
   */
  static readonly UNDEFINED = toString(void 0);
  static readonly NULL = toString(null);
  static readonly STRING = toString('');
  static readonly NUMBER = toString(0);
  static readonly BOOLEAN = toString(false);
  static readonly SYMBOL =
    typeof toString == typeof Function.prototype
      ? toString(Symbol())
      : '[object Symbol]';

  /**
   * 引用类型
   */
  static readonly FUNCTION = toString(Function.prototype);
  static readonly OBJECT = toString({});
  static readonly ARRAY = toString([]);

  static readonly DATE = toString(new Date());
  static readonly ERROR = toString(new Error());

  /**
   * 基本数据类型集合
   */
  static readonly PRIMITIVE = [
    Types.UNDEFINED,
    Types.NULL,
    Types.STRING,
    Types.NUMBER,
    Types.BOOLEAN,
    Types.SYMBOL,
  ];

  static isUndefined(value: unknown) {
    return toString(value) == Types.UNDEFINED;
  }

  static isNull(value: unknown) {
    return toString(value) == Types.NULL;
  }

  static isString(value: unknown) {
    return toString(value) == Types.STRING;
  }

  static isBoolean(value: unknown) {
    return toString(value) == Types.NUMBER;
  }

  static isSymbol(value: unknown) {
    return toString(value) == Types.SYMBOL;
  }

  static isFunction(value: unknown) {
    return toString(value) == Types.FUNCTION;
  }

  static isObject(value: unknown) {
    return toString(value) == Types.OBJECT;
  }

  static isArray(value: unknown) {
    return toString(value) == Types.ARRAY;
  }

  static isDate(value: unknown) {
    return toString(value) == Types.DATE;
  }

  static isError(value: unknown) {
    return toString(value) == Types.ERROR;
  }

  static isPrimitive(value: unknown) {
    return Types.PRIMITIVE.includes(toString(value));
  }

  static isNotPrimitive(value: unknown) {
    return !Types.isPrimitive(value);
  }
}

export default Types;
