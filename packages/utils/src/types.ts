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

/**
 * 实现函数重载 类型提示
 *
 * 自己实现还挺复杂的，lodash 之类的库都是用的这种方式
 *
 * 写着玩 别太当真
 */
export interface GetFromObject {
  <O extends object, K0 extends keyof O>(object: O, paths: [K0]): O[K0];

  <O extends object, K0 extends keyof O, K1 extends keyof O[K0]>(
    object: O,
    paths: [K0, K1]
  ): O[K0][K1];

  <
    O extends object,
    K0 extends keyof O,
    K1 extends keyof O[K0],
    K2 extends keyof O[K0][K1]
  >(
    object: O,
    paths: [K0, K1, K2]
  ): O[K0][K1][K2];

  <
    O extends object,
    K0 extends keyof O,
    K1 extends keyof O[K0],
    K2 extends keyof O[K0][K1],
    K3 extends keyof O[K0][K1][K2]
  >(
    object: O,
    paths: [K0, K1, K2, K3]
  ): O[K0][K1][K2][K3];

  <
    O extends object,
    K0 extends keyof O,
    K1 extends keyof O[K0],
    K2 extends keyof O[K0][K1],
    K3 extends keyof O[K0][K1][K2],
    K4 extends keyof O[K0][K1][K2][K3]
  >(
    object: O,
    paths: [K0, K1, K2, K3, K4]
  ): O[K0][K1][K2][K3][K4];

  <
    O extends object,
    K0 extends keyof O,
    K1 extends keyof O[K0],
    K2 extends keyof O[K0][K1],
    K3 extends keyof O[K0][K1][K2],
    K4 extends keyof O[K0][K1][K2][K3],
    K5 extends keyof O[K0][K1][K2][K3][K4]
  >(
    object: O,
    paths: [K0, K1, K2, K3, K4, K5]
  ): O[K0][K1][K2][K3][K4][K5];

  <
    O extends object,
    K0 extends keyof O,
    K1 extends keyof O[K0],
    K2 extends keyof O[K0][K1],
    K3 extends keyof O[K0][K1][K2],
    K4 extends keyof O[K0][K1][K2][K3],
    K5 extends keyof O[K0][K1][K2][K3][K4],
    K6 extends keyof O[K0][K1][K2][K3][K4][K5]
  >(
    object: O,
    paths: [K0, K1, K2, K3, K4, K5, K6]
  ): O[K0][K1][K2][K3][K4][K5][K6];

  <
    O extends object,
    K0 extends keyof O,
    K1 extends keyof O[K0],
    K2 extends keyof O[K0][K1],
    K3 extends keyof O[K0][K1][K2],
    K4 extends keyof O[K0][K1][K2][K3],
    K5 extends keyof O[K0][K1][K2][K3][K4],
    K6 extends keyof O[K0][K1][K2][K3][K4][K5],
    K7 extends keyof O[K0][K1][K2][K3][K4][K5][K6]
  >(
    object: O,
    paths: [K0, K1, K2, K3, K4, K5, K6, K7]
  ): O[K0][K1][K2][K3][K4][K5][K6][K7];

  <
    O extends object,
    K0 extends keyof O,
    K1 extends keyof O[K0],
    K2 extends keyof O[K0][K1],
    K3 extends keyof O[K0][K1][K2],
    K4 extends keyof O[K0][K1][K2][K3],
    K5 extends keyof O[K0][K1][K2][K3][K4],
    K6 extends keyof O[K0][K1][K2][K3][K4][K5],
    K7 extends keyof O[K0][K1][K2][K3][K4][K5][K6],
    K8 extends keyof O[K0][K1][K2][K3][K4][K5][K6][K7]
  >(
    object: O,
    paths: [K0, K1, K2, K3, K4, K5, K6, K7, K8]
  ): O[K0][K1][K2][K3][K4][K5][K6][K7][K8];

  <
    O extends object,
    K0 extends keyof O,
    K1 extends keyof O[K0],
    K2 extends keyof O[K0][K1],
    K3 extends keyof O[K0][K1][K2],
    K4 extends keyof O[K0][K1][K2][K3],
    K5 extends keyof O[K0][K1][K2][K3][K4],
    K6 extends keyof O[K0][K1][K2][K3][K4][K5],
    K7 extends keyof O[K0][K1][K2][K3][K4][K5][K6],
    K8 extends keyof O[K0][K1][K2][K3][K4][K5][K6][K7],
    K9 extends keyof O[K0][K1][K2][K3][K4][K5][K6][K7][K8]
  >(
    object: O,
    paths: [K0, K1, K2, K3, K4, K5, K6, K7, K8, K9]
  ): O[K0][K1][K2][K3][K4][K5][K6][K7][K8][K9];
}
