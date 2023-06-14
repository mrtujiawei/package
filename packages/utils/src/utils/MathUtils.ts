/**
 * 数学相关的工具函数
 * @filename packages/utils/src/utils/MathUtils.ts
 * @author Mr Prince
 * @date 2022-12-06 16:51:40
 */

import { fixed, isInteger } from './utils';

/**
 * 是否是自然数
 */
export const isNaturalNumber = (number: any) => {
  return isInteger(number) && Number(number) >= 0;
};

/**
 * 辗转相除法
 * @description 求最大公约数
 * @param dividend 被除数
 * @param divisor 除数
 */
const _gcd = (dividend: number, divisor: number): number => {
  const remainder = dividend % divisor;
  if (0 == remainder) {
    return divisor;
  }
  return gcd(divisor, remainder);
};

/**
 * 求最大公约数
 * @description 辗转相除法
 * @param dividend 被除数
 * @param divisor 除数
 * @throws {TypeError|RangeError}
 */
export const gcd = (dividend: number, divisor: number): number => {
  if (!isInteger(dividend)) {
    throw TypeError(`dividend must be integer`);
  }
  if (!isInteger(divisor)) {
    throw TypeError(`divisor must be integer`);
  }
  if (0 == dividend) {
    throw RangeError(`dividend can't be 0`);
  }
  if (0 == divisor) {
    throw RangeError(`divisor can't be 0`);
  }
  return _gcd(dividend, divisor);
};

/**
 * 最小公倍数: Least Common Multiple
 *
 * 整数的判断交给 gcd 去做
 */
export function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
}

/**
 * 计算多个数字的平方和的平方根
 */
export const hypot = (...values: number[]) => {
  return Math.hypot(...values);
};

/**
 * 求最右侧的1
 */
export const lowbit = (k: number) => {
  return k & -k;
};

/**
 * 求组合数
 * 只能计算比较小的m,n 大了容易溢出
 *  a
 * C
 *  b
 */
export function C(m: number, n: number) {
  let result = 1;
  for (let i = m + 1; i <= n; i++) {
    result *= i;
  }
  for (let i = 1; i <= n - m; i++) {
    result /= i;
  }
  return result;
}

/**
 * 百分比
 *
 * 数据过大可能引起异常
 * 如果结果是负数，也会向下取整
 * @example divToPercent(-1.001, 1) => -101%
 *
 * @param dividend 被除数
 * @param divisor 除数
 * @param precision 精度,默认保留整数部分
 */
export function divToPercent(
  dividend: number,
  divisor: number,
  precision: number = 0
) {
  let res = 0;

  if (divisor) {
    res = dividend / divisor;
  } else if (dividend) {
    res = dividend > 0 ? 1 : -1;
  }

  return fixed(res * 100, precision) + '%';
}

/**
 * 快速幂
 *
 * 快速求 base ** index
 *
 * 建议不要使用小数,经过运算后误差较大
 *
 * @param base 底数
 * @param index 指数
 * @param mod 一般来说，需要用到快速幂的，结果范围都超过能表示的最大整数
 * 需要对结果进行求余操作才能正常返回,否则大概率返回 Infinite
 * 建议不要超过 Math.sqrt(Number.MAX_SAFE_INTEGER)
 */
export function fastPow(base: number, index: number, mod: number): number {
  if (index < 0) {
    throw new RangeError(`暂不支持index(${index}) < 0`);
  }
  base = base % mod;
  if (0 == base) {
    return 0;
  }
  if (0 == index) {
    return 1;
  }
  if (1 == index) {
    return base;
  }

  if (index % 2 == 0) {
    return fastPow(base * base, index / 2, mod);
  } else {
    return base * fastPow(base * base, (index - 1) / 2, mod) % mod;
  }
}

/**
 * 所有小于等于n 的质数
 * 欧拉筛
 */
export function getPrimeList(n: number) {
  const primes: boolean[] = new Array(n + 1);
  const result: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (primes[i]) {
      continue;
    }
    primes[i] = true;
    result.push(i);
    for (let j = i + i; j <= n; j += i) {
      primes[j] = true;
    }
  }

  return result;
}

/**
 * 判断是否是素数
 */
export function isPrime(n: number) {
  if (n < 2) {
    return false;
  }
  const half = Math.ceil(n / 2);
  for (let i = 2; i <= half; i++) {
    if (n % i == 0) {
      return false;
    }
  }

  return true;
};
