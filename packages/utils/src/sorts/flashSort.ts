/**
 * FlashSort
 *
 * @filename packages/utils/src/sorts/flashSort.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-05-20 16:22:54
 */

import { getMinMaxIndex } from '../utils';

const flashSort = (arr: number[]): number[] => {
  const n = arr.length;
  const m = ~~(0.45 * n);

  // 某个桶的下标上限
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

  // 把最大值和第一个值交换？
  let hold = arr[max];
  arr[max] = arr[0];
  arr[0] = hold;

  // 重新排序 把元素放入对应的桶中
  // 部分有序的效果
  //
  // 从每个桶的最右边开始放
  // 知道把所有元素都放完
  let move = 0;
  let t: number;
  let flash: number;
  let j = 0;
  let k = m - 1;

  // 移动次数达到 n - 1
  // 相当于所有元素都移动过一次
  // 表明数据都已经放到对应的桶中
  while (move < n - 1) {
    // 上一个桶已经放好了
    // 移动到下一个桶
    while (j > l[k] - 1) {
      ++j;
      k = ~~(c1 * (arr[j] - arr[min]));
    }

    // 所有桶都已经放完
    if (k < 0) {
      break;
    }

    flash = arr[j];
    while (j != l[k]) {
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
