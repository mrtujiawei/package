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
import Counter from './Counter';
import { PromiseExecutor, PromiseReject, PromiseResolve } from '../types';

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

/**
 * 生成器迭代
 */
export function cancellable<T>(
  generator: Generator<Promise<any>, T, unknown>
): [() => void, Promise<T>] {
  // 用来标记当前执行的任务
  // 新任务执行时，taskId 更新并保存
  // 异步任务执行后需要判断和之前获取到的taskId 是否相同
  // 如果不同，表示当前任务被取消了
  // 不要继续执行下去
  const task = new Counter();
  let canceled = false;
  let resolve: PromiseResolve<T>;
  let reject: PromiseReject;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  // 执行代码时，不管是同步还是异步都需要 try ... catch
  // 同步任务的异常处理: 直接 reject (generator.next 或 generator.throw 时出现)
  // 异步任务的异常处理: generator.throw (yield promise 时出现)
  // 处理异步任务时，finally阶段 需要判断当前这个异步任务有没有被取消
  // 被取消时: 不做任何处理

  /**
   * generator.next 或 generator.throw 后
   * 返回的迭代器的值是一个 promise 时调用
   */
  const runAsyncTask = async (promise: Promise<T>, done?: boolean) => {
    const taskId = task.next();
    let value: any;
    let callback = resolve;
    try {
      value = await promise;
    } catch (e) {
      callback = reject;
      value = e;
    }
    if (taskId != task.getCurrent()) {
      return;
    }
    const method = callback == resolve ? 'next' : 'throw';
    done ? callback(value) : runTask({ value, method });
  };

  // generator.next 或 generator.throw
  // 如果出现异常，直接 reject，结束函数执行
  const runTask = ({
    value,
    method = 'next',
  }: {
    value?: T | string;
    method?: 'next' | 'throw';
  }) => {
    task.next();
    try {
      // 同步抛出错误
      const it = generator[method](value);
      if (it.value instanceof Promise) {
        runAsyncTask(it.value, it.done);
      } else {
        it.done ? resolve(it.value) : runTask({ value: it.value });
      }
    } catch (reason) {
      reject(reason);
    }
  };

  runTask({});

  return [
    (reason: string = 'Cancelled') => {
      if (canceled) {
        return;
      }
      canceled = true;
      runTask({ value: reason, method: 'throw' });
    },
    promise,
  ];
}

/**
 * 取消 promise
 */
export const cancelPromise = <T>(func: PromiseExecutor<T>) => {
  let resolve: PromiseResolve<T>;
  let reject: PromiseReject;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
    func(resolve, reject);
  });

  const cancel = (reason?: any) => {
    reject(reason);
  };

  return [cancel, promise];
};

/**
 * 直接初始化一个异步的值
 * 下次获取的时候能直接取到对应的值
 */
export const eagerGet = <T>(func: () => Promise<T>) => {
  let promise = func();
  return () => {
    const p = promise;
    promise = promise.then(func, func);
    return p;
  };
};
