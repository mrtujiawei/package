/**
 * 数组相关的工具函数
 *
 * utils.ts 中代码太长，拆分一下
 *
 * @filename packages/utils/src/utils/arrayUtils.ts
 * @author Mr Prince
 * @date 2023-04-20 09:41:53
 */

import { isNaturalNumber } from './MathUtils';
import Random from './Random';
import Types from './Types';

/**
 * split arr to chunks
 * every chunk's size is equal or less then size
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];

  if (arr.length > 0) {
    for (let i = 0; true; i++) {
      const start = i * size;
      const chunk = arr.slice(start, start + size);
      result.push(chunk);
      if (start + size >= arr.length) {
        break;
      }
    }
  }

  return result;
};

/**
 * 反转数组中的某一段(不包括end)
 */
export function reverseRange(arr: unknown[], start: number, end: number): void {
  let middle = ((end - start) >> 1) + start;
  for (let i = start; i < middle; i++) {
    swap(arr, i, end - i - 1 + start);
  }
}

/**
 * 交换数组中的两个元素
 * @returns - 修改过后的数组，和传入的是同一个数组
 */
export function swap<T>(arr: T[], index1: number, index2: number) {
  if (!isNaturalNumber(index1)) {
    throw new RangeError(`index1: ${index1} is not a valid index`);
  }
  if (!isNaturalNumber(index2)) {
    throw new RangeError(`index2: ${index2} is not a valid index`);
  }
  const length = arr.length;
  if (index1 >= length) {
    throw new RangeError(
      `index1: ${index1} is large than arr.length: ${length}`
    );
  }
  if (index2 >= length) {
    throw new RangeError(
      `index2: ${index2} is large than arr.length: ${length}`
    );
  }
  let value = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = value;
  return arr;
}

/**
 * 二分搜索
 * 找到第一个满足条件的下标
 * @param values - 有序数组
 * @param target - 目标值
 * @param compare - 比较函数: 返回 <0(a < b), 0(a == b), >0(a > b)
 */
export const findFirstIndex = <T>(
  values: T[],
  target: T,
  compare?: (a: T, b: T) => number
) => {
  if (!compare) {
    compare = (a, b) => {
      // @ts-ignore
      return a - b;
    };
  }

  // 左闭右开
  let left = 0;
  let right = values.length;

  while (left < right) {
    let middle = ((right - left) >> 1) + left;
    let cmp = compare(values[middle], target);

    // 中点小于目标值
    if (0 > cmp) {
      left = middle + 1;
      // 找到满足要求的下标
    } else if (0 <= cmp) {
      if (
        // 只有一个数可选
        left == middle ||
        // 左边没有大于等于目标值的下标
        (0 < middle && 0 > compare(values[middle - 1], target))
      ) {
        return middle;
      }
      right = middle;
    }
  }

  return -1;
};

/**
 * 判断两个数组中的元素是否完全相同
 */
export const isArrayElementsEqual = <T>(
  values0: T[],
  values1: T[],
  comparator = (value0: T, value1: T) => value0 == value1
) => {
  return (
    values0 == values1 ||
    (values0.length == values1.length &&
      values0.every((value0, index) => comparator(value0, values1[index])))
  );
};

/**
 * 数组去重
 */
export function distinct(arr: unknown[]) {
  const set = new Set<unknown>();
  return arr.filter((value) => {
    if (set.has(value)) {
      return false;
    }
    set.add(value);
    return true;
  });
}

type CA<T> = T extends (infer Item)[] ? Item[] : T[];

/**
 * 转化成数组
 * 原来是数组的不做任何处理
 */
export function castArray<T>(value: T): CA<T> {
  if (Types.isArray(value)) {
    return value as unknown as CA<T>;
  }

  return [value] as CA<T>;
}

/**
 * 数组浅拷贝 [start, end)
 * @param src 源数组
 * @param dest 目标数组
 * @param start 开始位置
 * @param end 结束位置 结束位置不能大于arr.length
 */
export function copyArray<T>(
  src: T[],
  dest: T[],
  start: number = 0,
  end: number = src.length
) {
  end = Math.min(src.length, end);
  for (let i = start; i < end; i++) {
    dest[i] = src[i];
  }
}

/**
 * 打乱数组，或称洗牌算法
 *
 * Knuth-Durstenfeld Shuffle
 */
export function shuffle<T>(values: T[]) {
  for (let i = values.length; i > 0; i--) {
    const index = Random.getRandomNumber(0, i);
    swap(values, i - 1, index);
  }
}

/**
 * 最大值下标
 */
export const findMaxIndex = (
  values: number[],
  startIndex: number = 0,
  endIndex: number = values.length
) => {
  let maxIndex = startIndex++;
  while (startIndex < endIndex) {
    if (values[maxIndex] < values[startIndex]) {
      maxIndex = startIndex;
    }
    startIndex++;
  }

  return maxIndex;
};

/**
 * 最小值下标
 */
export const findMinIndex = (
  values: number[],
  startIndex: number = 0,
  endIndex: number = values.length
) => {
  let minIndex = startIndex++;
  while (startIndex < endIndex) {
    if (values[minIndex] > values[startIndex]) {
      minIndex = startIndex;
    }
    startIndex++;
  }
  return minIndex;
};

/**
 * 最大最小值下标
 *
 * @return [minIndex, maxIndex]
 */
export const getMinMaxIndex = (arr: number[]) => {
  let min = 0;
  let max = 0;
  arr.forEach((value, index) => {
    if (arr[min] > value) {
      min = index;
    }
    if (arr[max] < value) {
      max = index;
    }
  });

  return [min, max];
};

