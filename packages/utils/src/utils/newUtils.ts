/**
 * utils.ts 内容太多了
 * 懒得移动
 * 直接新开一个
 *
 * @filename packages/utils/src/utils/newUtils.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-03-28 11:28:32
 */

import { isInteger } from './utils';

export const isPowerOfFour = (value: number) => {
  return (
    isInteger(value) &&
    value > 0 &&
    (value & (value - 1)) === 0 &&
    value % 3 === 1
  );
};

/**
 * >= value 的 2 的阶乘
 */
export const nextPowerOfTwo = (value: number) => {
  if (value > 0 && (value & (value - 1)) === 0) {
    return value;
  }
  let result = 1;
  while (value > 0) {
    result = result << 1;
    value = value >> 1;
  }
  return result;
};
