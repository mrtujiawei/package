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

export const j = () => {
  console.log('j');
};

export const k = () => {
  console.log('k');
};

export const l = () => {
  console.log('l');
};

export const m = () => {
  console.log('m');
};

export const n = () => {
  console.log('n');
};

export const o = () => {
  console.log('o');
};

export const p = () => {
  console.log('p');
};

export const q = () => {
  console.log('q');
};

export const r = () => {
  console.log('r');
};

export const s = () => {
  console.log('s');
};

export const t = () => {
  console.log('t');
};

export const u = () => {
  console.log('u');
};

export const v = () => {
  console.log('v');
};

export const w = () => {
  console.log('w');
};

export const x = () => {
  console.log('x');
};

export const y = () => {
  console.log('y');
};

export const z = () => {
  console.log('z');
};

export const aa = () => {
  console.log('aa');
};

export const ab = () => {
  console.log('ab');
};

export const ac = () => {
  console.log('ac');
};

export const ad = () => {
  console.log('ad');
};

export const ae = () => {
  console.log('ae');
};

export const af = () => {
  console.log('af');
};

export const ag = () => {
  console.log('ag');
};

export const ah = () => {
  console.log('ah');
};

export const ai = () => {
  console.log('ai');
};

export const aj = () => {
  console.log('aj');
};

export const ak = () => {
  console.log('ak');
};

export const al = () => {
  console.log('al');
};

export const am = () => {
  console.log('am');
};

export const an = () => {
  console.log('an');
};

export const ao = () => {
  console.log('ao');
};

export const ap = () => {
  console.log('ap');
};

export const aq = () => {
  console.log('aq');
};

export const ar = () => {
  console.log('ar');
};

export const as1 = () => {
  console.log('as1');
};

export const at1 = () => {
  console.log('at');
};

export const au = () => {
  console.log('au');
};

export const av = () => {
  console.log('av');
};

export const aw = () => {
  console.log('aw');
};

export const ax = () => {
  console.log('ax');
};

export const ay = () => {
  console.log('ay');
};

export const az = () => {
  console.log('az');
};
