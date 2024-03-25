import { identity } from '@mrtujiawei/utils';

/**
 * react 中更新数组的工具函数
 *
 * 减少模板代码
 *
 * [...arr.slice(0, index), value, ...arr.slice(index + 1)]
 */
export const updateArray = <T>(arr: T[], index: number, value: T) => {
  arr = arr.map(identity);
  arr[index] = value;
  return arr;
};

/**
 * 获取最新的 state
 *
 * 能不用还是不用吧
 */
export const getLatestState = <T>(setState: (cb: (value: T) => T) => T) => {
  let value!: T;
  setState((val) => {
    value = val;
    return val;
  });
  return value;
};
