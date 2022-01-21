const _toString = Object.prototype.toString;
export const toString = (obj: any): string => _toString.call(obj);

export class TYPES {
  static readonly UNDEFINED = toString(void 0);
  static readonly NULL = toString(null);
  static readonly STRING = toString('');
  static readonly NUMBER = toString(0);
  static readonly BOOLEAN = toString(false);
  static readonly FUNCTION = toString(Function.prototype);

  // symbol 可能会报错，直接写死吧
  static readonly SYMBOL = '[object Symbol]';
  static readonly OBJECT = toString({});
  static readonly ARRAY = toString([]);

  static readonly DATE = toString(new Date());
  static readonly ERROR = toString(new Error());
}

/**
 * 延迟一段时间(秒)
 */
export async function sleep(timeout: number = 0): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout * 1000);
  });
}

/**
 * 遍历对象所有属性
 * 移除左右两边空格
 */
export function trim<T>(data: T): T {
  if (typeof data == typeof {}) {
    for (let prop in data) {
      data[prop] = trim(data[prop]);
    }
  } else if (typeof data == typeof '') {
    // @ts-ignore
    data = data.trim();
  }
  return data;
}

/**
 * 不足位补0
 */
export function addZero(num: string | number, length: number = 2): string {
  return String(num).padStart(length, '0');
}

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
    .map((entry) => entry.split('=').map((value) => decodeURIComponent(value)))
    .reduce((params, [key, value]) => {
      params[decodeURIComponent(key)] = decodeURIComponent(value);
      return params;
    }, {} as Result);
};

/**
 * 判断是否是对象,排除null
 */
export const isObject = (object: unknown): boolean => {
  if (typeof {} != typeof object || toString(object) == TYPES.NULL) {
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
 * 判断是否是promise
 */
export function isPromise(val: any): boolean {
  // Promise.resolve(val) == Promise.resolve(val);
  return (
    val &&
    TYPES.FUNCTION == toString(val.then) &&
    TYPES.FUNCTION == toString(val.catch)
  );
}

export function identify(val: any): any {
  return val;
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
        if (isPromise(data)) {
          return data
            .then(identify)
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
function leading(callback: Function, timeout: number) {
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
  if (TYPES.NULL == type || TYPES.UNDEFINED == type) {
    return false;
  }

  return /^-?[0-9]+$/.test(number.toString());
}

/**
 * 是否是自然数
 */
export const isNaturalNumber = (number: any) => {
  return isInteger(number) && Number(number) >= 0;
};

/**
 * 隐藏部分手机号
 */
export const hiddenMobile = (mobile: string, hidden = '*'): string => {
  mobile = mobile || '';
  return mobile.replace(/\d{1,4}(?=(\d{4}$))/, ($0) => {
    return ''.padStart($0.length, hidden);
  });
};

/**
 * 反转数组中的某一段(不包括end)
 */
export function reverseRange(arr: any[], start: number, end: number): void {
  let middle = ((end - start) >> 1) + start;
  for (let i = start; i < middle; i++) {
    swap(arr, i, end - i - 1 + start);
  }
}

/**
 * 交换数组中的两个元素
 */
function swap(arr: any[], index1: number, index2: number): void {
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
 * 计算多个数字的平方和的平方根
 */
export const hypot = (...values: number[]) => {
  return Math.hypot(...values);
};

/**
 * 获取对象上的key
 * @param object - 目标对象
 * @param all - 是否获取全部的key，包括不可枚举的
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
 * 数字格式化
 * 1234 => 1.234
 */
export const numFormat = (num: number, delimiter: string = '.'): string => {
  const result = num.toString().replace(/\B(?=(\d{3})+$)/g, delimiter);

  return result;
};

/**
 * 对象转字符串
 * 不是为了格式化成json,只是为了可读,可保存
 * 会忽略循环引用的属性
 *
 * 1. 如果是字符串，加上标识直接返回
 * 2. 如果是undefined 或者 null，改成字符串
 * 3. 如果是Error,打印message 和 stack
 * 4. 如果是Date类型，返回标识和时间戳
 * 5. 如果是数组，加上标识,遍历下标,加上length
 * 6. 如果是对象, 加上标识,遍历属性
 */
export const objectToString = (
  data: any,
  references = new Set<any>()
): string => {
  // 出现循环引用
  if (references.has(data)) {
    return '(Circular Structure)';
  }

  const paramType = toString(data);

  const normalTypes = [TYPES.NULL, TYPES.NUMBER, TYPES.UNDEFINED, TYPES.SYMBOL];

  // 没必要特殊处理的类型,直接 转换成字符串
  if (normalTypes.includes(paramType)) {
    return String(data);
  }

  // 给 string 类型的加上字符串标识
  if (TYPES.STRING == paramType) {
    return `"${data}"`;
  }

  if (TYPES.FUNCTION == paramType) {
    return `function ${data.name}() { [code] }`;
  }

  if (TYPES.ERROR == paramType) {
    return `${data.message}: \n${data.stack}`;
  }

  if (TYPES.DATE == paramType) {
    return `Date(${data.getTime()})`;
  }

  // 以上类型都不满足
  // 说明是特殊的类型,添加到引入
  references.add(data);

  // 处理数组
  if (TYPES.ARRAY == paramType) {
    const result = [];
    result.push('[');

    for (let prop in data) {
      if (isInteger(prop)) {
        result.push(`${objectToString(data[prop], references)}, `);
      } else {
        result.push(`${prop}: ${data[prop]}, `);
      }
    }
    result.push(`length: ${data.length}`, ']');
    return result.join('');
  }

  // 处理对象
  if (TYPES.OBJECT == paramType) {
    const result = [];
    result.push('{ ');
    for (let prop in data) {
      result.push(`${prop} => ${objectToString(data[prop], references)}, `);
    }

    // 移掉最后多余的 逗号
    if (1 < result.length) {
      result[result.length - 1] = result[result.length - 1].slice(0, -2);
    }

    result.push(' }');
    return result.join('');
  }

  // 降级方案
  try {
    return JSON.stringify(data);
  } catch (e) {
    return data.toString();
  }
};

/**
 *
 */
export const test0 = () => {};

/**
 *
 */
export const test1 = () => {};

/**
 *
 */
export const test2 = () => {};

/**
 *
 */
export const test3 = () => {};

/**
 *
 */
export const test4 = () => {};

/**
 *
 */
export const test5 = () => {};

/**
 *
 */
export const test6 = () => {};

/**
 *
 */
export const test7 = () => {};

/**
 *
 */
export const test8 = () => {};

/**
 *
 */
export const test9 = () => {};

/**
 *
 */
export const test10 = () => {};
