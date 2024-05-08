/**
 * 循环排序
 *
 * 1. 找当前下标元素排序后的位置
 *    1.1 计算当前元素应该在的位置
 *    1.2 如果新的位置的值和当前值一样，继续往后移动
 * 2. 将元素移动到新的位置
 * 3. 重复上述步骤
 *
 * 考虑赋值操作比较少，如果赋值操作是性能瓶颈的话可以使用
 *
 * @filename packages/utils/src/sorts/cycleSort.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-05-08 13:53:14
 */

const cycleSort = (arr: number[]) => {
  for (let cycleStart = 0; cycleStart < arr.length; cycleStart++) {
    let value = arr[cycleStart];
    let position = cycleStart;

    for (let i = cycleStart + 1; i < arr.length; i++) {
      if (arr[i] < value) {
        position++;
      }
    }

    if (position === cycleStart) {
      continue;
    }

    while (value === arr[position]) {
      position++;
    }

    const oldValue = arr[position];
    arr[position] = value;
    value = oldValue;

    while (position !== cycleStart) {
      position = cycleStart;
      for (let i = cycleStart + 1; i < arr.length; i++) {
        if (arr[i] < value) {
          position++;
        }
      }
      while (value === arr[position]) {
        position++;
      }
      const oldValueCycle = arr[position];
      arr[position] = value;
      value = oldValueCycle;
    }
  }

  return arr;
};

export default cycleSort;
