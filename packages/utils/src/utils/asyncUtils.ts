/**
 * 异步相关的工具函数
 *
 * utils.ts 中代码太长，拆分一下
 *
 * @filename packages/utils/src/utils/asyncUtils.ts
 * @author Mr Prince
 * @date 2023-04-20 09:37:10
 */

import Types from './Types';
import { identity } from './pureFunction';

/**
 * @description 延迟一段时间(秒)
 */
export const sleep = async (timeout: number = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout * 1000);
  });
};

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

