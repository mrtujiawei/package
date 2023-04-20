/**
 * 一些不好分类的工具函数
 *
 * @filename packages/utils/src/utils/utils.ts
 * @author Mr Prince
 * @date 2023-04-20 09:50:23
 */

import { swap } from './arrayUtils';
import { isObject } from './objectUtils';
import { isSame } from './pureFunction';
import { toString } from './topLevelUtils';
import Types from './Types';

/**
 * 处理url请求参数
 * 需要手动加?
 */
export const objectToUrlParams = (params: object): string => {
  return Object.entries(params)
    .map((entry) => entry.map((value) => encodeURIComponent(value)))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

/**
 * 请求参数转对象
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

const DEFAULT_THROTTLE_OPTIONS = {
  timeout: 500,
  leading: false,
};

/**
 * 节流
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
 */
export const symbols = (object: Object) => {
  if (!isObject(object)) {
    return [];
  }
  return Object.getOwnPropertySymbols(object);
};

/**
 * 矩阵转置 不需要行列相等
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
 */
export function isShortPath(path: string) {
  return !/^(https?|\/\/)/.test(path);
}

/**
 * 尝试调用
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
 */
export function permute<T>(values: T[]): T[][] {
  const result: T[][] = [];
  permuteBacktrack(values, result, 0);
  return result;
}

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
