/**
 * 一些不好分类的工具函数
 *
 * @filename packages/utils/src/utils/utils.ts
 * @author Mr Prince
 * @date 2023-04-20 09:50:23
 */

import { GeneralFunction } from '../interfaces';
import { swap } from './arrayUtils';
import { isObject } from './objectUtils';
import { isSame } from './pureFunction';
import { toString } from './topLevelUtils';
import Types from './Types';

/**
 * 处理url请求参数
 * 需要手动加?
 *
 * @public
 */
export const objectToUrlParams = (params: object): string => {
  return Object.entries(params)
    .map((entry) => entry.map((value) => encodeURIComponent(value)))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

/**
 * 请求参数转对象
 *
 * @public
 */
export const urlParamsToObject = (urlParams: string) => {
  if (urlParams.startsWith('?')) {
    urlParams = urlParams.slice(1);
  }

  type Result = {
    [key: string]: string;
  };

  return urlParams
    .split('&')
    .filter((expression) => expression.length > 0)
    .map((entry) => entry.split('=').map((value) => decodeURIComponent(value)))
    .reduce((params, [key, value]) => {
      params[key] = value;
      return params;
    }, {} as Result);
};

/**
 * 防抖
 *
 * @public
 */
export function debounce(callback: Function, timeout: number): Function {
  let timer: any;

  return function (...args: any[]) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
      timer = null;
    }, timeout);
  };
}

type Options = {
  leading: boolean;
  timeout: number;
};

/**
 * @private
 */
const DEFAULT_THROTTLE_OPTIONS = {
  timeout: 500,
  leading: false,
};

/**
 * 节流
 *
 * @public
 */
export function throttle(
  callback: Function,
  options: Options = DEFAULT_THROTTLE_OPTIONS
) {
  return options.leading
    ? leading(callback, options.timeout)
    : trailing(callback, options.timeout);
}

/**
 * 立即执行节流
 *
 * @public
 */
export function leading(callback: Function, timeout: number) {
  let timer: any = null;
  let hadCall: boolean = false;
  let args: any[];

  function run(context: any): void {
    if (!timer) {
      timer = setTimeout(() => {
        if (hadCall) {
          hadCall = false;
          timer = null;
          run(context);
        } else {
          timer && clearTimeout(timer);
          timer = null;
        }
      }, timeout);

      callback.apply(context, args);
    } else {
      hadCall = true;
    }
  }

  return function (...params: any[]): any {
    args = params;
    // @ts-ignore
    run(this);
  };
}

/**
 * 延迟节流
 *
 * @public
 */
export function trailing(callback: Function, timeout: number) {
  let timer: any = null;
  let args: any[];
  return function (...params: any[]): any {
    args = params;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        // @ts-ignore
        callback.apply(this, args);
      }, timeout);
    }
  };
}

/**
 * 是否是整数
 *
 * @public
 */
export function isInteger(number: any) {
  const type = toString(number);
  if (Types.NULL == type || Types.UNDEFINED == type) {
    return false;
  }

  return /^-?[0-9]+$/.test(number.toString());
}

/**
 * 获取对象上的key
 *
 * @public
 * @param object - 目标对象
 * @param unenumerable - 是否获取全部的key，包括不可枚举的
 * @returns - 如果是null 或 undefined 或 非对象类型的 返回空字符串
 */
export const keys = (object: Object, unenumerable?: boolean): string[] => {
  if (!isObject(object)) {
    return [];
  }

  if (unenumerable) {
    return Object.getOwnPropertyNames(object);
  }

  return Object.keys(object);
};

/**
 * 获取对象的所有 symbol 属性
 *
 * @public
 */
export const symbols = (object: Object) => {
  if (!isObject(object)) {
    return [];
  }
  return Object.getOwnPropertySymbols(object);
};

/**
 * 矩阵转置 不需要行列相等
 *
 * @public
 */
export const matrixTransposition = <T>(arr: T[][]) => {
  return arr.reduce(
    (acc, val) => (val.forEach((v, i) => acc[i].push(v)), acc),
    Array.from(
      {
        length: Math.max(...arr.map((row) => row.length)),
      },
      () => [] as T[]
    )
  );
};

/**
 * rgb 转 hex
 *
 * @public
 */
export const rgbToHex = (r: number, g: number, b: number) => {
  const rangeCheck = (value: number) => {
    if (0 > value || 255 < value) {
      throw new RangeError('Color range is exceeded, [0, 255] is valid');
    }
  };

  rangeCheck(r);
  rangeCheck(g);
  rangeCheck(b);

  return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0').toUpperCase();
};

/**
 * 尾递归优化
 * 需要传入的函数最后返回一个新的函数或非函数的结果
 *
 * @public
 */
export const trampoline = <T extends Function>(fn: T) => {
  // @ts-ignore
  const trampolined: T = (...args: any[]) => {
    let result: any = fn(...args);
    while ('function' == typeof result) {
      result = result();
    }
    return result;
    // @ts-ignore
  };
  return trampolined;
};

/**
 * 精度转换
 * 超过 Number.MAX_SAFE_INTEGER 后无法处理
 *
 * @public
 * @description 如果 fractionDigits 为小数，向下取整,不支持 BigInt
 * @param number 要转换的数值
 * @param fractionDigits 小数点后位数, 负数会将整数部分改成0
 */
export const fixed = (number: number, fractionDigits: number) => {
  fractionDigits = Math.floor(fractionDigits);
  if (0 == fractionDigits) {
    return `${Math.floor(number)}`;
  }
  if (0 > fractionDigits) {
    return `${
      Math.floor(number * Math.pow(10, fractionDigits)) *
      Math.pow(10, -fractionDigits)
    }`;
  }
  const factor = Math.pow(10, fractionDigits);
  return `${(Math.floor(number * factor) / factor).toFixed(fractionDigits)}`;
};

/**
 * 获取全局对象
 *
 * @public
 */
export const getGlobalThis = (() => {
  let _globalThis: any;
  const _getGlobalThis = () => {
    if (_globalThis) {
      return _globalThis;
    }
    const UNDEFINED = typeof void 0;

    if (UNDEFINED != typeof globalThis) {
      _globalThis = globalThis;
    } else if (UNDEFINED != typeof self) {
      _globalThis = self;
    } else if (UNDEFINED != typeof window) {
      _globalThis = window;
    } else if (UNDEFINED != typeof global) {
      _globalThis = global;
    } else {
      _globalThis = {};
    }
    return _globalThis;
  };
  return _getGlobalThis;
})();

/**
 * 深层比较两个值是否相等
 *
 * @public
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (isSame(a, b)) {
    return true;
  }

  if (
    typeof a != 'object' ||
    a === null ||
    typeof b != 'object' ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => {
    return (
      Object.hasOwnProperty.call(b, key) &&
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    );
  });
}

/**
 * 获取嵌套对象或数组中的值
 *
 * @public
 */
export function getNestValue<T>(
  values: unknown,
  indexs: number[],
  defaultValue?: T
): T | undefined {
  type Result = Record<string | number | symbol, unknown>;
  let result = values as Result;

  for (let i = 0; i < indexs.length; i++) {
    const index = indexs[i];
    if (isObject(result) || Array.isArray(result)) {
      result = result[index] as Result;
    } else {
      return defaultValue;
    }
  }

  if (Types.isUndefined(result)) {
    return defaultValue;
  }

  return result as T;
}

/**
 * 判断是否是短路径
 *
 * 不以 http|https|// 开头的路径
 *
 * @public
 */
export function isShortPath(path: string) {
  return !/^(https?|\/\/)/.test(path);
}

/**
 * 尝试调用
 *
 * @public
 */
export function attempt<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> | Error {
  try {
    return fn(...args);
  } catch (e) {
    return Types.isError(e) ? e : new Error(e as string);
  }
}

/**
 * 解析URI
 *
 * [协议名]://[用户名]:[密码]@[主机名]:[端口]/[路径]?[查询参数]#[片段ID]
 *
 * 如果端口不是protocol 的默认端口
 * host需要加上对应的端口号, 否则不用
 *
 * [] 内部不能出现 [@:/?#] 等字符，否则解析可能会出现问题
 *
 * @public
 */
export function parseURI(uri: string) {
  let value = (uri || '').trim();
  if (uri.startsWith('//')) {
    // 移除前面多余的 //
    value = uri.slice(2);
  }
  let protocol = '';
  let username = '';
  let password = '';
  let hostname = '/';
  let port = '';
  let host = '';
  let pathname = '';
  let search = '';
  let hash = '';
  let origin = '';

  const hashFlag = '#';
  const hashIndex = value.indexOf(hashFlag);
  if (hashIndex != -1) {
    hash = value.slice(hashIndex);
    value = value.slice(0, hashIndex);
  }

  const searchFlag = '?';
  const searchIndex = value.indexOf(searchFlag);
  if (searchIndex != -1) {
    search = value.slice(searchIndex);
    value = value.slice(0, searchIndex);
  }

  const protocolFlag = '://';
  const protocolIndex = value.indexOf(protocolFlag);
  if (protocolIndex != -1) {
    protocol = value.slice(0, protocolIndex);
    value = value.slice(protocolIndex + protocolFlag.length);
  }

  const slashFlag = '/';
  const slashIndex = value.indexOf(slashFlag);

  if (slashIndex != -1) {
    pathname = value.slice(slashIndex);
    value = value.slice(0, slashIndex);
  }

  const portReg = /\d+$/;
  if (portReg.test(value)) {
    // 有指定port
    port = value.match(portReg)![0];

    // -1 移除 port 前的 :
    value = value.slice(0, value.length - port.length - 1);
  }

  const userInfoFlag = '@';
  const userInfoIndex = value.indexOf(userInfoFlag);
  if (userInfoIndex != -1) {
    const values = value.split('@');
    const userInfo = values[0];
    [username, password] = userInfo.split(':');
    value = values[1];
  }

  host = value;
  if (
    (protocol == 'http' && port != '80') ||
    (protocol == 'https' && port != '443')
  ) {
    hostname = `${host}:${port}`;
  } else {
    hostname = port;
  }

  if (protocol && host) {
    origin = `${protocol}://${hostname}`;
  }

  return {
    protocol,
    username,
    password,
    hostname,
    port,
    host,
    pathname,
    search,
    hash,
    href: uri,
    origin,
  };
}

/**
 * 全排列
 * 要求输入数据各不相同
 *
 * @public
 */
export function permute<T>(values: T[]): T[][] {
  const result: T[][] = [];
  permuteBacktrack(values, result, 0);
  return result;
}

/**
 * @private
 */
function permuteBacktrack<T>(values: T[], result: T[][], index: number) {
  if (index == values.length) {
    result.push(values.slice());
  }
  for (let i = index; i < values.length; i++) {
    swap(values, index, i);
    permuteBacktrack(values, result, index + 1);
    swap(values, index, i);
  }
}

/**
 * json转化
 *
 * @public
 */
export function jsonStringify<T>(object: T): string {
  // null
  if (object === null) {
    return 'null';
  }

  // boolean
  if (typeof object == 'boolean') {
    return object.toString();
  }

  // number
  if (typeof object == 'number') {
    return object + '';
  }

  // string
  if (typeof object == 'string') {
    return `"${object}"`;
  }

  // array
  if (Array.isArray(object)) {
    return `[${object.map(jsonStringify).join(',')}]`;
  }

  // object
  if (typeof object == 'object') {
    const result: string[] = [];
    for (const key in object) {
      result.push(`"${key}":${jsonStringify(object[key])}`);
    }
    return `{${result.join(',')}}`;
  }

  // default
  return object + '';
}

/**
 * 缓存函数
 */
export function memoize<T extends (...params: unknown[]) => any>(fn: T): T {
  const cache = [new Map()];

  const memoized = (...params: unknown[]): unknown => {
    let currentCache = cache;
    for (let i = 0; i < params.length; i++) {
      if (!currentCache[0].has(params[i])) {
        currentCache[0].set(params[i], [new Map()]);
      }
      currentCache = currentCache[0].get(params[i]);
    }

    if (currentCache.length < 2) {
      currentCache.push(fn(...params));
    }

    return currentCache[1];
  };

  return memoized as T;
}

/**
 * 比上面更高效的缓存函数
 */
export function linearMemoize<T extends (...params: unknown[]) => any>(
  fn: T
): T {
  const paramMap = new Map<unknown, number>();
  const cache = new Map<string, unknown>();

  const memoized = (...params: unknown[]): unknown => {
    const key = params
      .map((value) => {
        if (!paramMap.has(value)) {
          paramMap.set(value, paramMap.size);
        }
        return paramMap.get(value);
      })
      .join('.');
    if (!cache.has(key)) {
      const value = fn(...params);
      cache.set(key, value);
    }
    return cache.get(key);
  };

  return memoized as T;
}

/**
 * 对象 diff
 */
export function objDiff(obj1: any, obj2: any): any {
  // Array diff
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    const result: Record<string, any> = {};
    const length = Math.min(obj1.length, obj2.length);
    for (let i = 0; i < length; i++) {
      const value1 = obj1[i];
      const value2 = obj2[i];
      console.log({ value1, value2 });
    }
    return result;
  } else if (Array.isArray(obj1) || Array.isArray(obj2)) {
    return [obj1, obj2];
  }

  if (typeof obj1 == 'object' && typeof obj2 == 'object') {
    // Object Diff
    if (obj1 == null && obj2 == null) {
      return [];
    }

    if (obj1 == null || obj2 == null) {
      return [obj1, obj2];
    }

    const result: Record<string, any> = {};
    Object.keys(obj1).forEach((key) => {
      if (!obj2.hasOwnProperty(key)) {
        return;
      }
      const diff = objDiff(obj1[key], obj2[key]);
      if (diff.length > 0) {
        result[key] = diff;
      }
    });

    return result;
  }

  if (obj1 == obj2) {
    return [];
  }

  return [obj1, obj2];
}

/**
 * bem 模块名工具
 */
export const createBEM = (block: string) => {
  return (element?: string, modifier?: string) => {
    return `${block}${element ? '_' + element : ''}${
      modifier ? '--' + modifier : ''
    }`;
  };
};

/**
 * 能够重复调用的函数
 *
 * 重复调用不再次执行，直接返回上一次的执行结果
 */
export const reuse = <T extends GeneralFunction>(func: T) => {
  const result: unknown[] = [];

  // 内部类型需要更通用
  const newFunc: GeneralFunction = (...args) => {
    if (result.length == 0) {
      result.push(func(...args));
    }

    return result[0];
  };

  // 外部的类型需要更精确
  return newFunc as T;
};

/**
 * 懒初始化
 * 一个事件依赖另外一个数据
 * 但是数据是通过异步加载，两者之间比较难建立联系
 *
 * @example
 *
 * const [promise,resolve, reject] = lazyInit();
 *
 * promise.then(data => {
 *  console.log(data);
 * });
 *
 * resolve(1);
 */
export const lazyInit = <T>(): [
  Promise<T>,
  (value: T) => void,
  (reason?: any) => void
] => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: any) => void;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return [promise, resolve, reject];
};

/**
 * 是否是双击事件
 *
 * @param delta 两次事件间隔在 delta 内 返回 true
 */
export const isDbclick = (delta = 300) => {
  let lastEventTime = 0;

  return () => {
    const currentTime = new Date().getTime();
    let flag = false;

    if (currentTime - lastEventTime <= delta) {
      flag = true;
    }

    lastEventTime = flag ? 0 : currentTime;

    return flag;
  };
};

/**
 * 极简加密
 */
export const rot13 = (content: string) => {
  const result: string[] = [];

  for (const val of content) {
    if ((val >= 'a' && val <= 'z') || (val >= 'A' && val <= 'Z')) {
      if ((val >= 'n' && val <= 'z') || (val >= 'N' && val <= 'Z')) {
        result.push(String.fromCharCode(val.charCodeAt(0) - 13));
      } else {
        result.push(String.fromCharCode(val.charCodeAt(0) + 13));
      }
    } else {
      result.push(val);
    }
  }

  return result.join('');
};

/**
 * Vigenère cipher
 */
export const vigenere = (plaintext: string, key: string) => {
  const upperKey = key.toUpperCase();
  let decryptedMessage = '';
  for (let i = 0, keyIndex = 0; i < plaintext.length; keyIndex += 1, i += 1) {
    const val = plaintext.charCodeAt(i);
    const keyCode = upperKey.charCodeAt(keyIndex % upperKey.length);
    if (val >= 97 && val <= 122) {
      const index = (val - 97 + keyCode - 65) % 26;
      decryptedMessage += String.fromCharCode(index + 97);
    } else if (val >= 65 && val <= 90) {
      const index = (val - 65 + keyCode - 65) % 26;
      decryptedMessage += String.fromCharCode(index + 65);
    } else {
      keyIndex -= 1;
      decryptedMessage += String.fromCharCode(val);
    }
  }
  return decryptedMessage;
};

/**
 * 判断是否是手机号
 *
 * 中国的手机号一般是 11 位
 */
export const isPhoneNumber = (numbers: string) => {
  return numbers.length >= 7 && !/^1[3456789]\d{9}$/.test(numbers);
};

/**
 * 判断是否是 2 的 n 次幂
 */
export const isPowerOfTwo = (value: number) => {
  if (value < 1) {
    return false;
  }

  let dividedNumber = value;
  while (dividedNumber !== 1) {
    if (dividedNumber % 2 !== 0) {
      return false;
    }
    dividedNumber /= 2;
  }

  return true;
};

const ENGLISH_ALPHABET_COUNT = 26;
export const getEnglishAlphabet = () => {
  const a = 'a'.charCodeAt(0);
  return Array.from({ length: ENGLISH_ALPHABET_COUNT }, (_, i) =>
    String.fromCharCode(a + i)
  );
};

export const getUppercaseEnglishAlphabet = () => {
  const a = 'A'.charCodeAt(0);
  return Array.from({ length: ENGLISH_ALPHABET_COUNT }, (_, i) =>
    String.fromCharCode(a + i)
  );
};

/**
 * @param shift 偏移
 */
export const getCipherMap = (alphabet: string[], shift: number) => {
  if (!isInteger(shift)) {
    throw new TypeError('shift must be integer');
  }
  const charsMap: Record<string, string> = {};
  shift = shift % ENGLISH_ALPHABET_COUNT;

  alphabet.forEach((ch, index) => {
    const offsetIndex =
      (index + shift + ENGLISH_ALPHABET_COUNT) % ENGLISH_ALPHABET_COUNT;
    charsMap[ch] = alphabet[offsetIndex];
  });

  return charsMap;
};

/**
 * caesar cipher
 */
export const caesarCipherEncrypt = (
  str: string,
  shift: number,
  alphabet = getEnglishAlphabet()
) => {
  const cipherMap = getCipherMap(alphabet, shift);

  return str
    .toLowerCase()
    .split('')
    .map((ch) => cipherMap[ch] || ch)
    .join('');
};

export const caesarCipherDecrypt = (
  str: string,
  shift: number,
  alphabet = getEnglishAlphabet()
) => {
  const cipherMap = getCipherMap(alphabet, -shift);
  return str
    .toLowerCase()
    .split('')
    .map((ch) => cipherMap[ch] || ch)
    .join('');
};

/**
 * hill cipher
 */
const alphabetCodeShift = 'A'.codePointAt(0)!;

export const generateKeyMatrix = (key: string) => {
  const size = Math.sqrt(key.length);
  if (!isInteger(size)) {
    throw new TypeError(
      'Invalid key string length. Math.sqrt(key.length) must be integer'
    );
  }

  let keyStringIndex = 0;

  return generate([size, size], () => {
    const charCodeShifted =
      key.codePointAt(keyStringIndex)! % alphabetCodeShift;
    keyStringIndex++;
    return charCodeShifted;
  });
};

/**
 * 根据消息内容生成矩阵
 */
export const generateMessageVector = (message: string) => {
  return generate([message.length, 1], (cellIndices: number[]) => {
    const rowIndex = cellIndices[0];
    return message.codePointAt(rowIndex)! % alphabetCodeShift;
  });
};

export const hillCipherEncrypt = (message: string, key: string) => {
  const onlyLettersRegExp = /^[a-zA-Z]+$/;
  if (!onlyLettersRegExp.test(message) || !onlyLettersRegExp.test(key)) {
    throw new Error('The message and key string can only contain letters');
  }

  const keyMatrix = generateKeyMatrix(key);
  const messageVector = generateMessageVector(message);

  if (keyMatrix.length != message.length) {
    throw new Error(
      'Invalid key string length. The key length must be a square of message length'
    );
  }

  const cipherVector = dot(
    keyMatrix as unknown as number[][],
    messageVector as unknown as number[][]
  );

  let cipher = '';
  for (let row = 0; row < cipherVector.length; row++) {
    const item = cipherVector[row] as unknown as number;
    cipher += String.fromCharCode(
      (item % ENGLISH_ALPHABET_COUNT) + alphabetCodeShift
    );
  }

  return cipher;
};

/**
 * end of hill cipher
 */

export class PolynomialHash {
  private static readonly DEFAULT_BASE = 37;
  private static readonly DEFAULT_MODULUS = 101;

  base: number;
  modules: number;

  constructor({
    base = PolynomialHash.DEFAULT_BASE,
    modules = PolynomialHash.DEFAULT_MODULUS,
  }: {
    base?: number;
    modules?: number;
  }) {
    this.base = base;
    this.modules = modules;
  }

  hash(word: string) {
    const charCodes = Array.from(word).map((ch) => this.charToNumber(ch));
    let hash = 0;

    charCodes.forEach((code) => {
      hash *= this.base;
      hash += code;
      hash %= this.modules;
    });

    return hash;
  }

  roll(prevHash: number, prevWord: string, newWord: string) {
    let hash = prevHash;
    const prevValue = this.charToNumber(prevWord);
    const newValue = this.charToNumber(newWord);

    let prevValueMultiplier = 1;
    for (let i = 1; i < prevWord.length; i++) {
      prevValueMultiplier *= this.base;
      prevValueMultiplier %= this.modules;
    }

    hash += this.modules;
    hash -= (prevValue * prevValueMultiplier) % this.modules;

    hash *= this.base;
    hash += newValue;
    hash %= this.modules;

    return hash;
  }

  private charToNumber(ch: string) {
    let charCode = ch.codePointAt(0)!;
    const surrogate = ch.codePointAt(1);
    if (surrogate !== undefined) {
      const surrogateShift = 2 ** 16;
      charCode += surrogate * surrogateShift;
    }
    return charCode;
  }
}

/**
 * demo 不能直接使用
 */
export class SimplePolynomialHash {
  private static readonly DEFAULT_BASE = 17;

  constructor(private base = SimplePolynomialHash.DEFAULT_BASE) {}

  hash(word: string) {
    let hash = 0;
    Object.values(word).forEach((ch, index) => {
      hash += ch.charCodeAt(0) * this.base ** index;
    });
    return hash;
  }

  roll(prevHash: number, prevWord: string, newWord: string) {
    let hash = prevHash;
    const prevValue = prevWord.charCodeAt(0);
    const newValue = newWord.charCodeAt(newWord.length - 1);

    hash -= prevValue;
    hash /= this.base;
    hash += newValue * this.base ** (newWord.length - 1);

    return hash;
  }
}

/**
 * 简单实现
 */
export class BloomFilter {
  storage!: ReturnType<typeof this.createStore>;
  constructor(private size = 100) {
    this.createStore(this.size);
  }

  public insert(key: string) {
    const hashValues = this.getHashValues(key);

    hashValues.forEach((index) => {
      this.storage.setValue(index);
    });
  }

  public contains(key: string) {
    const hashValues = this.getHashValues(key);
    return hashValues.every((index) => this.storage.getValue(index));
  }

  private createStore(size: number) {
    const store = new Array(size).fill(false);
    const storageInterface = {
      getValue(index: number) {
        return store[index];
      },
      setValue(index: number) {
        return (store[index] = true);
      },
    };

    return storageInterface;
  }

  private hash1(key: string) {
    let hash = 0;
    for (const ch of key) {
      const code = ch.charCodeAt(0);
      hash = (hash << 5) + hash + code;
      hash &= hash;
      hash = Math.abs(hash);
    }

    return hash % this.size;
  }

  private hash2(key: string) {
    let hash = 5381;
    for (const ch of key) {
      const code = ch.charCodeAt(0);
      hash = (hash << 5) + hash + code;
    }

    return Math.abs(hash % this.size);
  }

  private hash3(key: string) {
    let hash = 0;
    for (const ch of key) {
      const code = ch.charCodeAt(0);
      hash = (hash << 5) - hash + code;
      hash &= hash;
    }

    return Math.abs(hash % this.size);
  }

  private getHashValues(key: string) {
    return [this.hash1(key), this.hash2(key), this.hash3(key)];
  }
}

/**
 * 矩阵的 shape
 */
export const shape = (matrix: unknown[][]) => {
  const shapes: number[] = [];
  let dimension: any[] = matrix;
  while (dimension && Array.isArray(dimension)) {
    shapes.push(dimension.length);
    dimension = (dimension.length && [...dimension][0]) || null;
  }

  return shapes;
};

/**
 * 检查是否是一个矩阵
 */
export const validateType = (matrix: unknown[][]) => {
  if (!matrix || !Array.isArray(matrix) || !Array.isArray(matrix[0])) {
    throw new TypeError('Invalid matrix format');
  }
};

export const validate2D = (matrix: unknown[][]) => {
  validateType(matrix);
  const sp = shape(matrix);
  if (sp.length != 2) {
    throw new Error('Matix is not of 2D shape');
  }
};

export const validateSameShape = (a: unknown[][], b: unknown[][]) => {
  validateType(a);
  validateType(b);

  const asp = shape(a);
  const bsp = shape(b);

  if (asp.length != bsp.length) {
    throw new Error('Matrices have different dimensions');
  }

  while (asp.length) {
    if (asp.pop() != bsp.pop()) {
      throw new Error('Matrices have different shapes');
    }
  }
};

/**
 * 矩阵生成
 */
export const generate = (msp: number[], fill: (index: number[]) => number) => {
  const generateRecurively = (
    recShape: number[],
    recIndices: number[]
  ): unknown[] => {
    if (recShape.length == 1) {
      return Array(recShape[0])
        .fill(null)
        .map((_, index) => fill([...recIndices, index]));
    }
    return Array.from({ length: recShape[0] }, (_, i) => {
      return generateRecurively(recShape.slice(1), [...recIndices, i]);
    });
  };

  return generateRecurively(msp, []);
};

export const zeros = (msp: number[]) => {
  return generate(msp, () => 0);
};

/**
 * 矩阵叉乘
 */
export const dot = (a: number[][], b: number[][]) => {
  validate2D(a);
  validate2D(b);

  const asp = shape(a);
  const bsp = shape(b);

  if (asp[1] !== bsp[0]) {
    throw new Error('Matrices have incompatible shape for multiplication');
  }

  const outputShape: number[] = [asp[0], bsp[1]];
  const c = zeros(outputShape) as number[][];

  for (let bCol = 0; bCol < b[0].length; bCol++) {
    for (let aRow = 0; aRow < a.length; aRow++) {
      let cellSum = 0;
      for (let aCol = 0; aCol < a[aRow].length; aCol++) {
        cellSum = a[aRow][aCol] * b[aCol][bCol];
      }
      c[aRow][bCol] = cellSum;
    }
  }

  return c;
};

/**
 * 矩阵遍历
 */
export const walk = (
  matrix: unknown[][],
  visit: (indexs: number[], value: unknown) => void
) => {
  const recWalk = (recM: unknown[][], cellIndices: number[]) => {
    const recMShape = shape(recM);
    if (recMShape.length == 1) {
      for (let i = 0; i < recM.length; i++) {
        visit([...cellIndices, i], recM[i]);
      }
    }
    for (let i = 0; i < recM.length; i++) {
      recWalk(recM[i] as unknown[][], [...cellIndices, i]);
    }
  };

  return recWalk(matrix, []);
};

/**
 * 获取指定位置的值
 */
export const getCellAtIndex = (matrix: unknown[][], cellIndices: number[]) => {
  let cell: any = matrix[cellIndices[0]];
  for (let dimIdx = 1; dimIdx < cellIndices.length - 1; dimIdx++) {
    cell = cell[cellIndices[dimIdx]];
  }
  return cell[cellIndices[cellIndices.length - 1]];
};

/**
 * 更新指定位置的值
 */
export const updateCellAtIndex = (
  matrix: unknown[][],
  cellIndices: number[],
  value: unknown
) => {
  let cell: any = matrix[cellIndices[0]];
  for (let dimIdx = 1; dimIdx < cellIndices.length - 1; dimIdx++) {
    cell = cell[cellIndices[dimIdx]];
  }

  cell[cellIndices[cellIndices.length - 1]] = value;
};

/**
 * 两个矩阵对应位置相加
 */
export const add = (a: number[][], b: number[][]) => {
  validateSameShape(a, b);
  const result: any = zeros(shape(a));

  walk(a, (cellIndices, value) => {
    updateCellAtIndex(result, cellIndices, value);
  });

  walk(b, (cellIndices, value) => {
    updateCellAtIndex(
      result,
      cellIndices,
      value + getCellAtIndex(result, cellIndices)
    );
  });

  return result;
};

export const mul = (a: number[][], b: number[][]) => {
  validateSameShape(a, b);
  const result: any = zeros(shape(a));

  walk(a, (cellIndices, value) => {
    updateCellAtIndex(result, cellIndices, value);
  });

  walk(b, (cellIndices, value) => {
    updateCellAtIndex(
      result,
      cellIndices,
      (value as number) * getCellAtIndex(result, cellIndices)
    );
  });

  return result;
};

export const sub = (a: number[][], b: number[][]) => {
  validateSameShape(a, b);
  const result: any = zeros(shape(a));

  walk(a, (cellIndices, value) => {
    updateCellAtIndex(result, cellIndices, value);
  });

  walk(b, (cellIndices, value) => {
    updateCellAtIndex(
      result,
      cellIndices,
      (value as number) - getCellAtIndex(result, cellIndices)
    );
  });

  return result;
};

export class RailFenceCipher {
  private static readonly DIRECTIONS = {
    UP: -1,
    DOWN: 1,
  };

  private buildFence(rowsNum: number) {
    return Array.from({ length: rowsNum }, () => []);
  }

  private getNextDirection({
    railCount,
    currentRail,
    direction,
  }: {
    railCount: number;
    currentRail: number;
    direction: number;
  }) {
    switch (currentRail) {
      case 0:
        return RailFenceCipher.DIRECTIONS.DOWN;
      case railCount - 1:
        return RailFenceCipher.DIRECTIONS.UP;
      default:
        return direction;
    }
  }

  private addCharToRail(targetRailIndex: number, letter: string) {
    const onEachRail = (rail: string[], currentRail: number) =>
      currentRail == targetRailIndex ? [...rail, letter] : rail;
    return onEachRail;
  }

  private fillEncodeFence({
    fence,
    currentRail,
    direction,
    chars,
  }: {
    fence: string[][];
    currentRail: number;
    direction: number;
    chars: string[];
  }): string[][] {
    if (chars.length == 0) {
      return fence;
    }

    const railCount = fence.length;

    const [letter, ...nextChars] = chars;
    const nextDirection = this.getNextDirection({
      railCount,
      currentRail,
      direction,
    });

    return this.fillEncodeFence({
      fence: fence.map(this.addCharToRail(currentRail, letter)),
      currentRail: currentRail + nextDirection,
      direction: nextDirection,
      chars: nextChars,
    });
  }

  private fillDecodeFence({
    strLen,
    chars,
    fence,
    targetRail,
    direction,
    coords,
  }: {
    strLen: number;
    chars: string[];
    fence: string[][];
    targetRail: number;
    direction: number;
    coords: number[];
  }): string[][] {
    const railCount = fence.length;

    if (chars.length == 0) {
      return fence;
    }

    const [currentRail, currentColumn] = coords;
    const shouldGoNextRail = currentColumn == strLen - 1;
    const nextDirection = shouldGoNextRail
      ? RailFenceCipher.DIRECTIONS.DOWN
      : this.getNextDirection({
          railCount,
          currentRail,
          direction,
        });
    const nextRail = shouldGoNextRail ? targetRail + 1 : targetRail;
    const nextCoords = [
      shouldGoNextRail ? 0 : currentRail + nextDirection,
      shouldGoNextRail ? 0 : currentRail + 1,
    ];

    const shouldAddChar = currentRail == targetRail;
    const [currentChar, ...remainderChars] = chars;
    const nextString = shouldAddChar ? remainderChars : chars;
    const nextFence = shouldAddChar
      ? fence.map(this.addCharToRail(currentRail, currentChar))
      : fence;

    return this.fillDecodeFence({
      strLen,
      chars: nextString,
      fence: nextFence,
      targetRail: nextRail,
      direction: nextDirection,
      coords: nextCoords,
    });
  }

  public decodeFence({
    strLen,
    fence,
    currentRail,
    direction,
    code,
  }: {
    railCount?: number;
    strLen: number;
    fence: string[][];
    currentRail: number;
    direction: number;
    code: string[];
  }): string {
    if (code.length == strLen) {
      return code.join('');
    }

    const railCount = fence.length;
    const [currentChar, ...nextRail] = fence[currentRail];
    const nextDirection = this.getNextDirection({
      railCount,
      currentRail,
      direction,
    });

    return this.decodeFence({
      railCount,
      strLen,
      currentRail: currentRail + nextDirection,
      direction: nextDirection,
      code: [...code, currentChar],
      fence: fence.map((rail, idx) => (idx == currentRail ? nextRail : rail)),
    });
  }

  public encodeRailFenceCipher(message: string, railCount: number) {
    const fence = this.buildFence(railCount);
    const filledFence = this.fillEncodeFence({
      fence,
      currentRail: 0,
      direction: RailFenceCipher.DIRECTIONS.DOWN,
      chars: message.split(''),
    });
    return filledFence.flat().join('');
  }

  public decodeRailFenceCipher(message: string, railCount: number) {
    const strLen = message.length;
    const emptyFence = this.buildFence(railCount);
    const filledFence = this.fillDecodeFence({
      strLen,
      chars: message.split(''),
      fence: emptyFence,
      targetRail: 0,
      direction: RailFenceCipher.DIRECTIONS.DOWN,
      coords: [0, 0],
    });

    return this.decodeFence({
      strLen,
      fence: filledFence,
      currentRail: 0,
      direction: RailFenceCipher.DIRECTIONS.DOWN,
      code: [],
    });
  }
}

type Callbacks = {
  allowTraversal?: (vertices: {
    currentVertex: Vertex;
    nextVertex: Vertex;
    previousVertex: Vertex;
  }) => boolean;
  enterVeter?: (vertices: {
    currentVertex?: Vertex;
    nextVertex?: Vertex;
    previousVertex?: Vertex;
  }) => void;
  leaveVertex?: (vertices: {
    currentVertex?: Vertex;
    nextVertex?: Vertex;
    previousVertex?: Vertex;
  }) => void;
};

export const initCallbacks = (callbacks: Callbacks = {}): Callbacks => {
  const initialedCallback = callbacks;

  const stubCallback = () => {};

  const allowTraversalCallback = (() => {
    const seen: Record<string, boolean> = {};
    return ({
      nextVertex,
    }: {
      currentVertex: Vertex;
      nextVertex: Vertex;
      previousVertex: Vertex;
    }) => {
      if (!seen[nextVertex.getKey()]) {
        seen[nextVertex.getKey()] = true;
        return true;
      }
      return false;
    };
  })();

  initialedCallback.allowTraversal =
    callbacks.allowTraversal || allowTraversalCallback;
  initialedCallback.enterVeter = callbacks.enterVeter || stubCallback;
  initialedCallback.leaveVertex = callbacks.leaveVertex || stubCallback;

  return initialedCallback;
};

class Vertex {
  getKey() {
    return '';
  }
}

interface Graph {}

// TODO 等完全梳理完再写
export const dfsRecursive = (
  graph: Graph,
  currentVertex: Vertex,
  previousVertex: Vertex,
  callbacks: Required<Callbacks>
) => {
  graph;
  callbacks.enterVeter({ currentVertex, previousVertex });
  // graph.
};

/**
 * 牛顿法计算给定精度的数字的平方根
 * @param tolerance - 小数点后的有效位数
 */
export const squareRoot = (value: number, tolerance = 0) => {
  if (value < 0) {
    throw new Error('Only positive integers');
  }

  if (value == 0) {
    return 0;
  }

  let root = 1;

  const requiredDelta = 1 / 10 ** tolerance;

  while (Math.abs(value - root ** 2) > requiredDelta) {
    root -= (root ** 2 - value) / (2 * root);
  }

  return Math.round(root * 10 ** tolerance) / 10 ** tolerance;
};

export const degreeToRadian = (degree: number) => {
  return (degree / 180) * Math.PI;
};

export const radianToDegree = (radian: number) => {
  return (radian * 180) / Math.PI;
};

/**
 * 二进制宽度
 */
export const bitWidth = (value: number) => {
  let count = 0;
  while (1 << count <= value) {
    count++;
  }
  return count;
};

/**
 * a -> b 需要改变的位数
 */
export const bitsDiff = (a: number, b: number) => {
  if (!(isInteger(a) && isInteger(b))) {
    throw new Error('Invalid input, a & b must be integer');
  }

  let count = 0;
  while (a || b) {
    if ((a & 1) != (b & 1)) {
      count++;
    }
    a = Math.floor(a / 2);
    b = Math.floor(b / 2);
  }

  return count;
};

/**
 * 二进制表示中有多少个1
 */
export const bit1Count = (value: number) => {
  if (!isInteger(value)) {
    throw new Error('Invalid input, number must be integer');
  }
  let count = 0;
  while (value) {
    if (value & 1) {
      count++;
    }
    value = Math.floor(value / 2);
  }

  return count;
};

export const clearBit = (value: number, bitPosotion: number) => {
  return (value &= ~(1 << bitPosotion));
};

export const divideByTow = (value: number) => {
  if (!isInteger(value)) {
    throw new Error('number must be integer');
  }

  return Math.floor(value / 2);
};

export const getBit = (value: number, bitPosition: number) => {
  if (!isInteger(value) || !isInteger(bitPosition)) {
    throw new Error('input must be integer');
  }
  if (bitPosition < 0) {
    throw new Error('bitPosition must >= 0');
  }

  while (bitPosition) {
    bitPosition--;
    value = Math.floor(value / 2);
  }

  return value & 1;
};

export const setBit = (value: number, bitPosition: number) => {
  return value | (1 << bitPosition);
};

export const updateBit = (
  value: number,
  bitPosition: number,
  bitValue: number
) => {
  if (bitValue == 0) {
    return value & (1 << bitPosition);
  }
  return value | (1 << bitPosition);
};

/**
 * 汉明距离
 */
export const hammingDistance = (a: string, b: string) => {
  if (a.length != b.length) {
    throw new Error('Strings must be of the same length');
  }

  let distance = 0;
  Object.keys(a).forEach((ch, i) => {
    if (ch != b[i]) {
      distance++;
    }
  });

  return distance;
};
