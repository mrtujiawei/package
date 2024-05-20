/**
 * 煎饼排序
 *
 * @filename packages/utils/src/sorts/pancakeSort.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-05-20 16:50:29
 */

import { findMaxIndex, reverseRange } from '../utils';

const pancakeSort = (array: number[]) => {
  for (let subarraySize = array.length; subarraySize > 1; subarraySize--) {
    const maximumIndex = findMaxIndex(array, 0, subarraySize);

    if (maximumIndex !== subarraySize - 1) {
      reverseRange(array, 0, maximumIndex + 1);
      reverseRange(array, 0, subarraySize);
    }
  }

  return array;
};

export default pancakeSort;
