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
