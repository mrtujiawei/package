/**
 * 鸽巢排序
 *
 * @filename packages/utils/src/sorts/pigeonHoleSort.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-05-20 17:31:19
 */

import { getMinMaxIndex } from '../utils';

export const pigeonHoleSort = (arr: number[]) => {
  const [min, max] = getMinMaxIndex(arr).map((index) => arr[index]);

  const range = max - min + 1;
  const pigeonhole = Array(range).fill(0);

  for (let i = 0; i < arr.length; i++) {
    pigeonhole[arr[i] - min]++;
  }

  let index = 0;

  for (let i = 0; i < range; i++) {
    while (pigeonhole[i]-- > 0) {
      arr[index++] = i + min;
    }
  }
  return arr;
};
