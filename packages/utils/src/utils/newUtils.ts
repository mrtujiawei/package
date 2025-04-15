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
import Lock from './Lock';
import { GeneralFunction } from '../interfaces';

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

export const cartesianProduct = <T>(a: T[], b: T[]) => {
  return Array.from(a, (val1) => {
    return Array.from(b, (val2) => [val1, val2]);
  });
};

const luhnValidation = (creditCard: string) => {
  let validationSum = 0;
  creditCard.split('').forEach((digit, index) => {
    let currentDigit = parseInt(digit);
    if (index % 2 === 0) {
      // Multiply every 2nd digit from the left by 2
      currentDigit *= 2;
      if (currentDigit > 9) {
        // if product is greater than 10 add the individual digits of the product to get a single digit
        currentDigit %= 10;
        currentDigit += 1;
      }
    }
    validationSum += currentDigit;
  });

  return validationSum % 10 === 0;
};

/**
 * 验证信用卡号是否有效
 */
export const validateCreditCard = (creditCard: string) => {
  const validStartSubString = ['4', '5', '6', '37', '34', '35']; // Valid credit card numbers start with these numbers

  if (typeof creditCard !== 'string') {
    throw new TypeError('The given value is not a string');
  }

  const errorMessage = `${creditCard} is an invalid credit card number because `;
  if (isNaN(Number(creditCard))) {
    throw new TypeError(errorMessage + 'it has nonnumerical characters.');
  }
  const creditCardStringLength = creditCard.length;
  if (!(creditCardStringLength >= 13 && creditCardStringLength <= 16)) {
    throw new Error(errorMessage + 'of its length.');
  }
  if (
    !validStartSubString.some((subString) => creditCard.startsWith(subString))
  ) {
    throw new Error(errorMessage + 'of its first two digits.');
  }
  if (!luhnValidation(creditCard)) {
    throw new Error(errorMessage + 'it fails the Luhn check.');
  }

  return true;
};

/**
 * 加权随机
 */
export const weightedRandom = (items: number[], weights: number[]) => {
  if (items.length !== weights.length) {
    throw new Error('Items and weights must be of the same size');
  }

  if (!items.length) {
    throw new Error('Items must not be empty');
  }

  const cumulativeWeights: number[] = new Array(items.length);
  for (let i = 0; i < weights.length; i += 1) {
    cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
  }

  const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
  const randomNumber = maxCumulativeWeight * Math.random();

  for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
    if (cumulativeWeights[itemIndex] >= randomNumber) {
      return {
        item: items[itemIndex],
        index: itemIndex,
      };
    }
  }
};

export const jumpSearch = (sortedArray: number[], seekElement: number) => {
  const arraySize = sortedArray.length;

  if (!arraySize) {
    return -1;
  }

  const jumpSize = Math.floor(Math.sqrt(arraySize));

  let blockStart = 0;
  let blockEnd = jumpSize;
  while (seekElement > sortedArray[Math.min(blockEnd, arraySize) - 1]) {
    blockStart = blockEnd;
    blockEnd += jumpSize;
    if (blockStart > arraySize) {
      return -1;
    }
  }

  for (let i = blockStart; i < Math.min(blockEnd, arraySize); i++) {
    if (sortedArray[i] == seekElement) {
      return i;
    }
  }

  return -1;
};

/**
 * 算是二分搜索的改进，根据 delta 决定 middle 的位置
 */
export const interpolationSearch = (
  sortedArray: number[],
  seekElement: number
) => {
  let leftIndex = 0;
  let rightIndex = sortedArray.length - 1;

  while (leftIndex <= rightIndex) {
    const rangeDelta = sortedArray[rightIndex] - sortedArray[leftIndex];
    const indexDelta = rightIndex - leftIndex;
    const valueDelta = seekElement - sortedArray[leftIndex];

    if (valueDelta < 0) {
      return -1;
    }

    if (!rangeDelta) {
      return sortedArray[leftIndex] === seekElement ? leftIndex : -1;
    }

    const middleIndex =
      leftIndex + Math.floor((valueDelta * indexDelta) / rangeDelta);

    if (sortedArray[middleIndex] == seekElement) {
      return middleIndex;
    }

    if (sortedArray[middleIndex] < seekElement) {
      leftIndex = middleIndex + 1;
    } else {
      rightIndex = middleIndex - 1;
    }
  }

  return -1;
};

/**
 * 空函数 不执行任何操作
 */
export const noop = (..._args: any[]) => {};

/**
 * 字符串比较
 * @returns a < b -1 ? a > b ? 1 : 0
 */
export const stringComparator = (a: string, b: string) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

/**
 * 复制并执行 splice 操作
 * 返回新的数组
 */
export const toSpliced = <T>(
  values: T[],
  start: number,
  deleteCount: number,
  ...items: T[]
) => {
  const result = values.slice();
  result.splice(start, deleteCount, ...items);
  return result;
};

/**
 * 复制并更新数组
 * 返回新的数组
 */
export const updateArray = <T>(arr: T[], index: number, value: T) => {
  return toSpliced(arr, index, 1, value);
};

/**
 * 获取对象排序后的 key
 */
export const getObjectSortedKeys = (obj: Record<string, any>) => {
  return Object.keys(obj).sort();
};

/**
 * 获取对象的 value 并根据 key 排序
 */
export const getObjectSortedValues = (obj: Record<string, any>) => {
  return getObjectSortedKeys(obj).map((key) => obj[key]);
};

/**
 * 获取对象的 entry 并根据 key 排序
 */
export const getObjectSortedEntries = (obj: Record<string, any>) => {
  return getObjectSortedKeys(obj).map((key) => [key, obj[key]]);
};

/**
 * 图片加马赛克
 *
 * @param options - 配置项
 * @param options.width - 图片宽度
 * @param options.height - 图片高度
 * @param options.range - 马赛克范围 range * range 大小的块
 *
 * @example
 * sharp('<img path>')
 *   .raw()
 *   .toBuffer({ resolveWithObject: true })
 *   .then((img) => {
 *     const uint8Array = new Uint8Array(img.data);
 *     return sharp(
 *       mosaic(uint8Array, {
 *         width: img.info.width,
 *         height: img.info.height,
 *         size: 2,
 *       }),
 *       {
 *         raw: {
 *           width: img.info.width,
 *           height: img.info.height,
 *           channels: img.info.channels,
 *         },
 *       }
 *     ).toFile('<output path>');
 *   });
 */
export const mosaic = (
  buffer: Uint8Array,
  options: {
    width: number;
    height: number;
    size: number;
  }
) => {
  const { width, height, size } = options;
  const newBuffer = buffer.slice();
  const colorSize = 4;
  for (let i = 0; i < height; i += size) {
    for (let j = 0; j < width; j += size) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;
      for (let y = i; y < i + size && y < height; y++) {
        for (let x = j; x < j + size && x < width; x++) {
          const index = (width * y + x) * colorSize;
          r += newBuffer[index];
          g += newBuffer[index + 1];
          b += newBuffer[index + 2];
          a += newBuffer[index + 3];
          count++;
        }
      }

      let ar = r / count;
      let ag = g / count;
      let ab = b / count;
      let aa = a / count;

      for (let y = i; y < i + size && y < height; y++) {
        for (let x = j; x < j + size && x < width; x++) {
          const index = (width * y + x) * colorSize;
          newBuffer[index] = ar;
          newBuffer[index + 1] = ag;
          newBuffer[index + 2] = ab;
          newBuffer[index + 3] = aa;
        }
      }
    }
  }

  return newBuffer;
};

/**
 * 异步任务运行，限制最大同时运行数量
 */
export const runLimit = async <T>(
  tasks: (() => Promise<T>)[],
  limit: number
) => {
  const lock = new Lock(limit);
  const result: T[] = [];

  tasks.forEach(async (task, index) => {
    await lock.lock();
    const res = await task();
    result[index] = res;
    lock.unlock();
  });

  // 等待所有任务完成
  for (let i = 0; i < limit; i++) {
    await lock.lock();
  }

  // 释放资源
  // 不确定是否会内存泄漏
  // 但是释放使用的资源是不会有错的
  for (let i = 0; i < limit; i++) {
    lock.unlock();
  }

  return result;
};

export const clamp = (value: number, min: number, max: number) => {
  if (min > max) {
    throw new RangeError('min must less or equal to max');
  }

  return Math.min(max, Math.max(min, value));
};

/**
 * 函数批量调用
 */
export const batchInvoke = <T extends GeneralFunction>(
  functions: T[],
  ...params: any[]
) => {
  return functions.map((fn) => fn(...params));
};

export const f = () => {
  console.log('f run');
};

export const g = () => {
  console.log('g run');
};

export const h = () => {
  console.log('h run');
};

export const i = () => {
  console.log('i run');
};

export const j = () => {
  console.log('j run');
};

export const k = () => {
  console.log('j run');
};

export const l = () => {
  console.log('l run');
};

export const m = () => {
  console.log('m run');
};

export const n = () => {
  console.log('n run');
};

export const o = () => {
  console.log('o run');
};
