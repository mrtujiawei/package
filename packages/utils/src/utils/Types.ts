/**
 * 类型相关的操作
 */
import { toString } from '../utils/topLevelUtils';

/**
 * @public
 */
class Types {
  /**
   * 原始类型
   */
  static readonly UNDEFINED = toString(void 0);
  static readonly NULL = toString(null);
  static readonly STRING = toString('');
  static readonly NUMBER = toString(0);
  static readonly BOOLEAN = toString(false);
  static readonly SYMBOL = toString(Symbol());
  static readonly BIG_INT = toString(BigInt('0'));

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
    Types.BIG_INT,
  ];

  /**
   * 是否是 undefined
   */
  static isUndefined(value: unknown): value is undefined {
    return toString(value) == Types.UNDEFINED;
  }

  /**
   * 是否是null
   */
  static isNull(value: unknown): value is null {
    return toString(value) == Types.NULL;
  }

  /**
   * 是否是字符串
   */
  static isString(value: unknown): value is string {
    return toString(value) == Types.STRING;
  }

  /**
   * 是否是 boolean
   */
  static isBoolean(value: unknown): value is boolean {
    return toString(value) == Types.NUMBER;
  }

  /**
   * 是否是 symbol
   */
  static isSymbol(value: unknown): value is symbol {
    return toString(value) == Types.SYMBOL;
  }

  /**
   * 是否是BIG_INT
   */
  static isBigInt(value: unknown): value is bigint {
    return toString(value) == Types.BIG_INT;
  }

  /**
   * 是否是函数
   */
  static isFunction(value: unknown): value is Function {
    return toString(value) == Types.FUNCTION;
  }

  /**
   * 是否是object
   */
  static isObject(value: unknown): value is Object {
    return toString(value) == Types.OBJECT;
  }

  /**
   * 是否是数组
   */
  static isArray(value: unknown): value is Array<unknown> {
    return toString(value) == Types.ARRAY;
  }

  /**
   * 是否是 date
   */
  static isDate(value: unknown): value is Date {
    return toString(value) == Types.DATE;
  }

  /**
   * 是否是Error
   */
  static isError(value: unknown): value is Error {
    return toString(value) == Types.ERROR;
  }

  /**
   * 是否是Promise
   */
  static isPromise(value: unknown): value is Promise<unknown> {
    const val = value as Promise<unknown>;
    return (
      Boolean(val) &&
      Types.isFunction(val.then) &&
      Types.isFunction(val.catch)
    );
  }

  /**
   * 是否是基本类型
   */
  static isPrimitive(value: unknown) {
    return Types.PRIMITIVE.includes(toString(value));
  }

  /**
   * 是否是引用类型
   */
  static isNotPrimitive(value: unknown) {
    return !Types.isPrimitive(value);
  }
}

export default Types;
