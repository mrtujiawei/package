/**
 * 一些公共的类型
 * @filename: package/packages/utils/src/types.ts
 * @author: Mr Prince
 * @date: 2022-06-23 14:01:11
 */

import { requireNonNull } from './utils/objectUtils';

/**
 * 基础数据类型
 * @link {https://262.ecma-international.org/13.0/#sec-overview}
 */
export type Primitive =
  | string
  | number
  | boolean
  | undefined
  | null
  | symbol
  | BigInt;

/**
 * 比较器
 * @returns a == b 返回 0, a < b => (< 0), a > b => (> 0)
 */
export type Compare<T> = (a: T, b: T) => number;

/**
 * Promise 相关类型
 */
export type PromiseResolve<T> = (value: T | PromiseLike<T>) => void;
export type PromiseReject = (reason?: any) => void;
export type PromiseExecutor<T> = (
  resolve: PromiseResolve<T>,
  reject: PromiseReject
) => void;

export interface Runnable {
  run(): void;
}

/**
 * 对象类型展开
 * 主要是用在函数参数上
 */
export type ExpandObject<T> = T extends infer Obj
  ? { [Key in keyof Obj]: ExpandObject<Obj[Key]> }
  : T;

export type Key = number | string;
