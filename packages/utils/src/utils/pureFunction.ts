/**
 * 纯函数
 * @filename packages/utils/src/utils/pureFunction.ts
 * @author Mr Prince
 * @date 2023-04-20 10:42:54
 */

/**
 * 返回所有真值
 */
export function compact(arr: unknown[]) {
  return arr.filter((value) => Boolean(value));
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
 * 返回原来的值
 */
export function identity<T>(value: T): T {
  return value;
}

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

  const receiver: unknown = (...args: any[]) => {
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

  return receiver as T;
};
