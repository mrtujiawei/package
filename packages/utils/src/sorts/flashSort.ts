/**
 * FlashSort
 * @filename packages/utils/src/sorts/flashSort.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-05-20 16:22:54
 */

import { getMinMaxIndex } from '../utils';

const flashSort = (arr: number[]): number[] => {
  const n = arr.length;
  const m = ~~(0.45 * n);
  const l = new Array<number>(m).fill(0);

  const [min, max] = getMinMaxIndex(arr);

  // 所有元素都一样 不需要排序
  if (arr[min] === arr[max]) {
    return arr;
  }

  // 计算桶的大小
  const c1 = (m - 1) / (arr[max] - arr[min]);

  // 放入桶中
  for (let j = 0; j < n; ++j) {
    const k = ~~(c1 * (arr[j] - arr[min]));
    ++l[k];
  }

  // 计算前缀和
  for (let p = 1; p < m; ++p) {
    l[p] += l[p - 1];
  }

  let hold = arr[max];
  arr[max] = arr[0];
  arr[0] = hold;

  // TODO 从这里开始看
  // 重新排序
  let move = 0;
  let t;
  let flash;
  let j = 0;
  let k = m - 1;

  while (move < n - 1) {
    while (j > l[k] - 1) {
      ++j;
      k = ~~(c1 * (arr[j] - arr[min]));
    }
    if (k < 0) break;
    flash = arr[j];
    while (j !== l[k]) {
      k = ~~(c1 * (flash - arr[min]));
      hold = arr[(t = --l[k])];
      arr[t] = flash;
      flash = hold;
      ++move;
    }
  }

  // 插入排序
  for (j = 1; j < n; j++) {
    hold = arr[j];
    let i = j - 1;
    while (i >= 0 && arr[i] > hold) {
      arr[i + 1] = arr[i--];
    }
    arr[i + 1] = hold;
  }

  return arr;
};

export default flashSort;
