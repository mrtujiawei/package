import { isNaturalNumber } from './MathUtils';
import Random from './Random';
import { toString } from './topLevelUtils';
import Types from './Types';

/**
 * @description 延迟一段时间(秒)
 */
export const sleep = async (timeout: number = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout * 1000);
  });
};

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
 * 判断是否是对象,排除null
 */
export const isObject = (object: unknown): boolean => {
  if (typeof {} != typeof object || toString(object) == Types.NULL) {
    return false;
  }
  return true;
};

/**
 * 判断是不是一个没有任何属性的对象
 */
export function isPlainObject(obj: any): boolean {
  if (!isObject(obj)) {
    return false;
  }
  for (const _ in obj) {
    return false;
  }
  return true;
}

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

/**
 * 返回原来的值
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * 重试函数
 */
export function retry(callback: Function, times: number = 2): Function {
  return function (...args: any[]): any {
    let cnt = 0;

    function catchError(err: any, ...args: any[]) {
      if (cnt++ < times) {
        return recursion(...args);
      }
      throw new Error(err.message);
    }

    function recursion(...args: any[]): any {
      try {
        let data = callback(...args);
        if (Types.isPromise(data)) {
          return data
            .then(identity)
            .catch((err: Error) => catchError(err, ...args));
        } else {
          return data;
        }
      } catch (err) {
        return catchError(err, ...args);
      }
    }

    return recursion(...args);
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
 * 反转数组中的某一段(不包括end)
 */
export function reverseRange(arr: unknown[], start: number, end: number): void {
  let middle = ((end - start) >> 1) + start;
  for (let i = start; i < middle; i++) {
    swap(arr, i, end - i - 1 + start);
  }
}

/**
 * 交换数组中的两个元素
 */
export function swap(arr: any[], index1: number, index2: number): void {
  if (!isNaturalNumber(index1)) {
    throw new RangeError(`index1: ${index1} is not a valid index`);
  }
  if (!isNaturalNumber(index2)) {
    throw new RangeError(`index2: ${index2} is not a valid index`);
  }
  const length = arr.length;
  if (index1 >= length) {
    throw new RangeError(
      `index1: ${index1} is large than arr.length: ${length}`
    );
  }
  if (index2 >= length) {
    throw new RangeError(
      `index2: ${index2} is large than arr.length: ${length}`
    );
  }
  let value = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = value;
}

/**
 * 重入函数,不绑定 this
 * 和实际的重入函数可能不太一样
 * 我要做的是:
 * 1. 多次调用函数，
 * 2. 后一次调用时，前一次的调用未结束
 * 3. 丢弃前一次的调用结果
 *
 * 对js来说，同步的函数是不太可能会被中断的
 * 所以我做的其实只能中断异步函数
 */
export const reentrant = (callback: (...args: any[]) => Promise<any>) => {
  let id = 0;
  return async (...args: any[]) => {
    id++;
    const currentId = id;
    const result = await callback.apply(null, args);
    if (id == currentId) {
      return result;
    }
    return new Promise(() => {});
  };
};

/**
 * 二分搜索
 * 找到第一个满足条件的下标
 * @param values - 有序数组
 * @param target - 目标值
 * @param compare - 比较函数: 返回 <0(a < b), 0(a == b), >0(a > b)
 */
export const findFirstIndex = <T>(
  values: T[],
  target: T,
  compare?: (a: T, b: T) => number
) => {
  if (!compare) {
    compare = (a, b) => {
      // @ts-ignore
      return a - b;
    };
  }

  // 左闭右开
  let left = 0;
  let right = values.length;

  while (left < right) {
    let middle = ((right - left) >> 1) + left;
    let cmp = compare(values[middle], target);

    // 中点小于目标值
    if (0 > cmp) {
      left = middle + 1;
      // 找到满足要求的下标
    } else if (0 <= cmp) {
      if (
        // 只有一个数可选
        left == middle ||
        // 左边没有大于等于目标值的下标
        (0 < middle && 0 > compare(values[middle - 1], target))
      ) {
        return middle;
      }
      right = middle;
    }
  }

  return -1;
};

/**
 * 判断两个值是否相同
 */
export const isSame = (value1: unknown, value2: unknown): boolean => {
  // 简洁
  // return !value1 === !value2;

  // 是否两个都是NaN
  if (value1 !== value1 && value2 !== value2) {
    return true;
  }

  return value1 === value2;
};

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
 * 函数式编程的开始，HOF
 */
export const not = <T extends Function>(fn: T) => {
  // @ts-ignore
  let negated: T = (...args: any[]) => {
    return !fn(...args);
  };
  return negated;
};

/**
 * 延迟求值
 */
export const lazy = <T extends Function>(fn: T) => {
  let result: any;
  let initFlag = false;
  return () => {
    if (initFlag) {
      return result;
    }
    result = fn();
    initFlag = true;
    return result;
  };
};

/**
 * 预先求值
 */
export const eager = <T extends Function>(fn: T) => {
  const result = fn();
  return () => {
    return result;
  };
};

/**
 * 缓存执行结果
 * @param fn 需要缓存结果的函数
 * @param resolver 计算出缓存 key 的函数
 */
export const memorize = <T extends Function>(
  fn: T,
  resolver: (...args: any[]) => string
) => {
  const cache = new Map<any, any>();

  // @ts-ignore
  const memorized: T = (...args: any[]) => {
    const key: string = resolver(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const res = fn(...args);
    cache.set(key, res);
    return res;
  };

  return memorized;
};

/**
 * 类型是可以实现的
 * 使用多个泛型 n个参数的泛型，一个返回值的泛型
 * 但是实现非常繁琐，没必要
 */
export const currying = <T extends Function>(fn: T) => {
  const length = fn.length;
  let received: any[] = [];

  // @ts-ignore
  const receiver: T = (...args: any[]) => {
    if (0 == args.length || 0 == length) {
      return fn(...args);
    } else {
      received.push(...args);
    }

    if (received.length >= length) {
      return fn(...received);
    }

    return receiver;
  };

  return receiver;
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
 * 判断两个数组中的元素是否完全相同
 */
export const isArrayElementsEqual = <T>(
  values0: T[],
  values1: T[],
  comparator = (value0: T, value1: T) => value0 == value1
) => {
  return (
    values0 == values1 ||
    (values0.length == values1.length &&
      values0.every((value0, index) => comparator(value0, values1[index])))
  );
};

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
 * 返回所有真值
 */
export function compact(arr: unknown[]) {
  return arr.filter((value) => Boolean(value));
}

/**
 * 数组去重
 */
export function distinct(arr: unknown[]) {
  const set = new Set<unknown>();
  return arr.filter((value) => {
    if (set.has(value)) {
      return false;
    }
    set.add(value);
    return true;
  });
}

type CA<T> = T extends (infer Item)[] ? Item[] : T[];

/**
 * 转化成数组
 * 原来是数组的不做任何处理
 */
export function castArray<T>(value: T): CA<T> {
  if (Types.isArray(value)) {
    return value as unknown as CA<T>;
  }

  return [value] as CA<T>;
}

/**
 * 数组浅拷贝 [start, end)
 * @param src 源数组
 * @param dest 目标数组
 * @param start 开始位置
 * @param end 结束位置 结束位置不能大于arr.length
 */
export function copyArray<T>(
  src: T[],
  dest: T[],
  start: number = 0,
  end: number = src.length
) {
  end = Math.min(src.length, end);
  for (let i = start; i < end; i++) {
    dest[i] = src[i];
  }
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
 * 如果是 null 或者 undefined 或者NaN
 *
 * 则返回 默认值
 */
export function defaultTo<T>(value: T | null | undefined, defaultValue: T) {
  if (value == null || value != value) {
    return defaultValue;
  }
  return value;
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
 * 打乱数组，或称洗牌算法
 *
 * Knuth-Durstenfeld Shuffle
 */
export function shuffle<T>(values: T[]) {
  for (let i = values.length; i > 0; i--) {
    const index = Random.getRandomNumber(0, i);
    swap(values, i - 1, index);
  }
}

/**
 * 二进制码转格雷码
 * 看不懂自己查文档
 */
export const binaryCodeToBinaryGrayCode = (n: number) => {
  return n ^ (n >> 1);
};

/**
 * 生成长度为 n 的 二进制格雷码
 * 看不懂自己查文档
 */
export function binaryGrayCode(n: number) {
  const codes: number[] = new Array(2 ** n);
  for (let i = 0; i < codes.length; i++) {
    codes[i] = binaryCodeToBinaryGrayCode(i);
  }
  return codes;
}

/**
 * 格雷码转二进制
 * 看不懂自己查文档
 */
export function binaryGrayCodeToBinaryCode(grayCode: number) {
  let result = 0;

  for (let i = 29; i >= 0; i--) {
    const g = (result & (1 << (i + 1))) >> 1;
    const b = grayCode & (1 << i);
    result |= g ^ b;
  }

  return result;
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

/**
 * Hierholzer算法
 * 欧拉回路
 * 需要 图 是欧拉图，顶点的度都是偶数
 *
 * (grid[x][y] == 0 || grid[x][y] == 1) == true 成立
 * grid[x][y] == 1 表示 x 有条到 y 的路径
 * grid[x][y] == 0 表示 x 没有到 y 的路径
 *
 * @param grid 邻接矩阵, 必须是欧拉图
 */
export const hierholzer = (grid: number[][]) => {
  const path: number[] = [];

  const dfs = (x: number) => {
    for (let i = 0; i < grid[x].length; i++) {
      if (grid[x][i]) {
        grid[x][i]--;
        grid[i][x]--;
        dfs(i);
      }
    }
    path.push(x);
  };

  dfs(0);

  return path.reverse();
};

/**
 * 字符串预处理
 */
const manacherPreprocess = (str: string, prefix: string, padding: string) => {
  const n = str.length;
  const result: string[] = new Array(n * 2 + 2);

  result[0] = prefix;
  for (let i = 0; i < n; i++) {
    const index = i << 1;
    result[index + 1] = padding;
    result[index + 2] = str[i];
  }
  result[n * 2 + 1] = padding;

  return result;
};

/**
 * manacher 马拉车算法
 *
 * @param str 字符串
 * @param prefix 前缀字符，不存在str中
 * @param padding 填充字符，不存在str中
 *
 * @returns 最长回文子串的长度
 */
export const manacher = (
  str: string,
  prefix: string = '^',
  padding: string = '#'
) => {
  const chars = manacherPreprocess(str, prefix, padding);

  // 解决重复计算问题
  const radius = new Array(chars.length).fill(0);

  let center = 0;
  let right = 0;

  let maxLen = 1;
  let maxCenter = 0;

  for (let i = 1; i < chars.length; i++) {
    // mirror 是 i 关于 center 的对称点
    // 有: (i + mirror) / 2 = center
    let mirror = 2 * center - i;

    // 如果在回文范围外， 需要从 1 开始计算
    // 否则 根据和对称点相同
    // 对称点可能超出当前回文串的范围，需要根据 right - i 来判断
    radius[i] = i >= right ? 1 : Math.min(right - i, radius[mirror]);
    while (chars[i + radius[i]] == chars[i - radius[i]]) {
      radius[i]++;
    }
    if (radius[i] + i > right) {
      right = radius[i] + i;
      center = i;
    }
    if (maxLen < radius[i]) {
      maxLen = radius[i];
      maxCenter = i;
    }
  }

  // TODO 返回值可以更通用一点
  let start = (maxCenter - radius[maxCenter]) >> 1;

  return str.substring(start, start + maxLen - 1);
};

/**
 * 部分和、前缀和
 */
export function partialSum(values: number[]) {
  if (values.length == 0) {
    return [0];
  }

  const result: number[] = new Array(values.length + 1);
  result[0] = 0;

  values.forEach((value, index) => {
    result[index + 1] = value + result[index];
  });

  return result;
}

/**
 * 二维部分和，二维前缀和
 * 基于容斥原理
 */
export function partialSum2(values: number[][]) {
  // 输入数据检查
  const m = values.length;
  if (m == 0) {
    return [];
  }
  const n = values[0].length;
  if (n == 0) {
    return Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  }

  const result: number[][] = Array.from(
    { length: m + 1 },
    () => new Array(n + 1)
  );
  result[0].fill(0);
  for (let i = 1; i <= m; i++) {
    result[i][0] = 0;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      result[i + 1][j + 1] =
        values[i][j] + result[i + 1][j] + result[i][j + 1] - result[i][j];
    }
  }

  return result;
}

/**
 * 三维部分和，三维前缀和
 * dp
 */
export function partialSum3(values: number[][][]) {
  const x = values.length;
  const y = values[0].length;
  const z = values[0][0].length;
  const result = Array.from({ length: x + 1 }, (_v, i) =>
    Array.from({ length: y + 1 }, (_v, j) =>
      Array.from({ length: z + 1 }, (_v, k) => {
        if (0 == i || 0 == j || k == 0) {
          return 0;
        }
        return values[i - 1][j - 1][k - 1];
      })
    )
  );

  for (let i = 1; i <= x; i++) {
    for (let j = 1; j <= y; j++) {
      for (let k = 1; k <= z; k++) {
        result[i][j][k] += result[i - 1][j][k];
      }
    }
  }

  for (let i = 1; i <= x; i++) {
    for (let j = 1; j <= y; j++) {
      for (let k = 1; k <= z; k++) {
        result[i][j][k] += result[i][j - 1][k];
      }
    }
  }

  for (let i = 1; i <= x; i++) {
    for (let j = 1; j <= y; j++) {
      for (let k = 1; k <= z; k++) {
        result[i][j][k] += result[i][j][k - 1];
      }
    }
  }

  return result;
}

/**
 * 是否含有重复字符
 */
export function hasRepeatChar(str: string | string[]) {
  const set = new Set<string>();

  for (const ch of str) {
    // 内循环是为了处理字符数组中每一项有多个字符的情况
    for (const c of ch) {
      if (set.has(c)) {
        return true;
      } else {
        set.add(c);
      }
    }
  }

  return false;
}

/**
 * 一维数组的前缀和区间查询
 * @param values 前缀和数组，从0开始
 * @param left 左端点, 包含
 * @param right 右端点, 包含
 * @returns [left, right] 区间内数据的和
 */
export function partialSumQuery(values: number[], left: number, right: number) {
  // 校验逻辑
  if (
    left < 0 ||
    left >= values.length ||
    right < 0 ||
    right >= values.length
  ) {
    throw new RangeError(
      `left(${left}) or right(${right}) is not in range [0, ${
        values.length - 1
      }]`
    );
  }

  if (left > right) {
    throw new RangeError(`left(${left}) is bigger then right(${right})`);
  }

  return values[right + 1] - values[left];
}

/**
 * 二维数组的前缀和区间查询
 * @param values 前缀和数组，从0开始
 * @param top 上端点, 包含
 * @param left 左端点, 包含
 * @param bottom 下端点, 包含
 * @param right 右端点, 包含
 * @returns 左上顶点为[top, left] 右下顶点为[bottom, right] 的矩形范围内数据的和
 */
export function partialSum2Query(
  values: number[][],
  top: number,
  left: number,
  bottom: number,
  right: number
) {
  /**
   * 坐标检查
   */
  const checkPosition = (x: number, y: number) => {
    if (0 <= x && x < values.length && 0 <= y && y < values[x].length) {
      return;
    }
    throw new RangeError(`position [${x}, ${y}] is not valid`);
  };

  checkPosition(top, left);
  checkPosition(bottom, right);

  // 是否存在合理范围
  if (top > bottom || left > right) {
    throw new RangeError(`has no valid area`);
  }

  return (
    values[bottom + 1][right + 1] +
    values[top][left] -
    values[bottom + 1][left] -
    values[top][right + 1]
  );
}

/**
 * n的二级制, 从右数的第 k 位的数值
 * @param n >= 0
 * @param k >= 0, 等于0表示最后一位
 */
export function bit(n: number, k: number): 0 | 1 {
  if (((n >> k) & 1) == 1) {
    return 1;
  }
  return 0;
}

/**
 * n的二级制, 从右数的第 k 位的数值是否为1
 * @param n >= 0
 * @param k >= 0, 等于0表示最后一位
 */
export function is1FromRightK(n: number, k: number) {
  return bit(n, k) == 1;
}

/**
 * n的二级制, 从右数的第 k 位的数值设置为1
 * @param n >= 0
 * @param k >= 0, 等于0表示最后一位
 */
export function set1FromRightK(n: number, k: number) {
  return n | (1 << k);
}

/**
 * 将最后一位 1 设置为0
 * @param n > 0
 */
export function set0FromRight(n: number) {
  return n & (n - 1);
}

/**
 * 判断 n 是否是2的幂
 */
export function is2N(n: number) {
  return (n & (n - 1)) == 0;
}

/**
 * 统计 n 的二进制中有多少个 1
 */
export function bitCount(n: number) {
  let count = 0;

  while (n > 0) {
    count += n & 1;
    n >>= 1;
  }

  return count;
}

/**
 * split arr to chunks
 * every chunk's size is equal or less then size
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];

  if (arr.length > 0) {
    for (let i = 0; true; i++) {
      const start = i * size;
      const chunk = arr.slice(start, start + size);
      result.push(chunk);
      if (chunk.length < size) {
        break;
      }
    }
  }

  return result;
};

/**
 * throw Exception when timeout
 */
export const requestTimeout = <T>(
  callback: () => T | Promise<T>,
  timeout: number,
  timeoutCallback: (value: T) => void
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    let timeoutFlag = false;
    const timer = setTimeout(() => {
      timeoutFlag = true;
      reject(new Error('Timeout'));
    }, timeout);
    const value = await callback();
    clearTimeout(timer);
    resolve(value);
    timeoutFlag && timeoutCallback(value);
  });
};

/**
 * 遍历自己的属性
 */
export const forEachOwnProperties = <T extends Object>(
  obj: T,
  callback: (value: T[keyof T], key: keyof T, context: T) => void
) => {
  // Object.keys 同理
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      return;
    }
    callback(obj[key], key, obj);
  }
};
