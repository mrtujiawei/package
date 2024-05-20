/**
 * 选择排序
 *
 * @filename packages/utils/src/sorts/selectionSort.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-05-20 17:35:45
 */

import { findMinIndex, swap } from '../utils';

const selectionSort = (arr: number[]) => {
  const length = arr.length;
  for (let i = 0; i < length - 1; i++) {
    const min = findMinIndex(arr, i, length);
    if (min != i) {
      swap(arr, i, min);
    }
  }
  return arr;
};

export default selectionSort;
