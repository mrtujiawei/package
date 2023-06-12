/**
 * 统一入口
 * @filename packages/utils/src/interfaces/index.ts
 * @author Mr Prince
 * @date 2022-11-30 11:21:50
 */

export type { default as Comparable } from './Comparable';

/**
 * 嵌套数组
 */
export type NestedArray<T> = (T | NestedArray<T>)[];

/**
 * 嵌套对象
 *
 * 没什么意义的类型
 */
export type NestedObject<T> = {
  [key: string]: T | NestedObject<T>;
};

/**
 * 通用函数类型
 */
export type GeneralFunction = (...args: any[]) => any;
