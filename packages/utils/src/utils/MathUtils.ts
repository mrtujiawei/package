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
  if (mod == 0) {
    throw new RangeError('mod must not be 0');
  }
  if (0 == index) {
    return 1 % mod;
  }
  base = base % mod;
  if (0 == base || 1 == index) {
    return base;
  }

  if (index % 2 == 0) {
    return fastPow(base * base, index / 2, mod);
  } else {
    return (base * fastPow(base * base, (index - 1) / 2, mod)) % mod;
  }
}

/**
 * 快速幂
 *
 * 快速求 base ** index
 *
 * 不支持小数
 *
 * @param base 底数
 * @param index 指数
 * @param mod 除数 求余用
 */
export const fastPowBigInt = (
  base: bigint,
  index: bigint,
  mod: bigint
): bigint => {
  if (0n == index) {
    return 1n % mod;
  }
  base = base % mod;
  if (0n == base || index == 1n) {
    return base;
  }

  if (index % 2n == 0n) {
    return fastPowBigInt(base * base, index / 2n, mod);
  } else {
    return (
      (base * BigInt(fastPowBigInt(base * base, (index - 1n) / 2n, mod))) % mod
    );
  }
};

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
}

/**
 * 生成所有组合可能性
 * generateCombinations(10, 3) ->
 * [[1, 2, 3], [1, 2, 4], ...]
 */
export const generateCombinations = (n: number, k: number) => {
  let currentCombination: number[] = [];
  let allCombinations: number[][] = [];
  let currentValue = 1;

  const findCombinations = () => {
    if (currentCombination.length === k) {
      allCombinations.push(currentCombination.slice());
      return;
    }
    if (currentValue > n) {
      // Check for exceeding the range
      return;
    }
    currentCombination.push(currentValue++);
    findCombinations();
    currentCombination.pop();
    findCombinations();
    currentValue--;
  };

  findCombinations();

  return allCombinations;
};

/**
 * 生成有效的括号对
 * @param n - 括号对数
 */
export const generateParentheses = (n: number) => {
  const res: string[] = [];

  const solve = (value: string, left: number, right: number) => {
    if (left === n && right === n) {
      res.push(value);
      return;
    }

    if (left <= n) {
      solve(value + '(', left + 1, right);
    }

    if (right < left) {
      solve(value + ')', left, right + 1);
    }
  };

  solve('', 0, 0);

  return res;
};

/**
 * 二进制转十进制
 */
export const binaryToDecimal = (binaryString: string) => {
  if (!binaryString) {
    return 0;
  }
  if (!/^[01]+$/.test(binaryString)) {
    throw new Error('Invalid binaryString, only support (0|1)');
  }
  let decimalNumber = 0;
  let base = 1;
  for (const val of binaryString.split('').reverse()) {
    decimalNumber += Number(val) * base;
    base *= 2;
  }
  return decimalNumber;
};

/**
 * 统一
 */
export const normalizeNumSign = (num: number) => {
  if (num === 0) {
    return 0;
  }
  if (num > 0) {
    return 1;
  }
  if (num < 0) {
    return -1;
  }

  return NaN;
};

/**
 * 获取一个数所有的因数
 */
export const getFactors = (num: number) => {
  if (num <= 0) {
    throw new Error(`Invalid input, num ${num} is <= 0`);
  }
  if (!isInteger(num)) {
    throw new Error(`Invalid input, num ${num} is not a integer`);
  }

  const factors: number[] = [1];
  const end = Math.sqrt(num);
  for (let i = 2; i <= end; i++) {
    if (num % i == 0) {
      factors.push(i);
      factors.push(num / i);
    }
  }

  if (end * end == num) {
    factors.pop();
  }

  return factors;
};

/**
 * 获取所有质因数
 */
export const getPrimeFactors = (num: number) => {
  const primeFactors: number[] = [];

  for (let i = 2; i * i <= num; i++) {
    while (num % i == 0) {
      primeFactors.push(i);
      num /= i;
    }
  }

  if (num > 1) {
    primeFactors.push(num);
  }

  return primeFactors;
};

/**
 * 求二元一次方程的根
 *
 * @example ax^2 + bx + c = 0;
 *
 * @param a - 二次方的系数
 * @param b - 一次放的系数
 * @param c - 常数项
 */
export const quadraticRoots = (a: number, b: number, c: number) => {
  const discriminant = b * b - 4 * a * c;
  const result: number[] = [];
  if (discriminant == 0) {
    result.push(-b / (2 * a));
  } else {
    result.push((-b + discriminant) / (2 * a), (-b - discriminant) / (2 * a));
  }
};

/**
 * 数字翻转
 */
export const reverse = (num: number) => {
  let result: number = 0;

  while (num > 0) {
    result = result * 10 + (num % 10);
    num = Math.floor(num / 10);
  }

  return result;
};

/**
 * 获取数据中位数
 */
export const getMedianNumber = (arr: number[]) => {
  const numbers = arr.slice().sort((a, b) => a - b);
  const numLength = numbers.length;

  return numLength % 2 === 0
    ? (numbers[numLength / 2 - 1] + numbers[numLength / 2]) / 2
    : numbers[Math.floor(numLength / 2)];
};

/**
 * 直接计算斐波那契的第 n 项
 */
export const fibonacci = (() => {
  const sqrt5 = Math.sqrt(5);
  const phi = (1 + sqrt5) / 2;
  const psi = (1 - sqrt5) / 2;
  return (n: number) => Math.round((phi ** n - psi ** n) / sqrt5);
})();

/**
 * 统计位数为 length 的二机制中有多少个 1
 *
 * 找规律
 *         1
 *       1 0
 *       1 1
 *     1 0 0
 *     1 0 1
 *     1 1 0
 *     1 1 1
 *   1 0 0 0
 *   1 0 0 1
 *   1 0 1 0
 *   1 0 1 1
 *   1 1 0 0
 *   1 1 0 1
 *   1 1 1 0
 *   1 1 1 1
 * 1 0 0 0 0
 * 1 0 0 0 1
 * 1 0 0 1 0
 * 1 0 0 1 1
 * 1 0 1 0 0
 * 1 0 1 0 1
 * 1 0 1 1 0
 * 1 0 1 1 1
 * 1 1 0 0 0
 * 1 1 0 0 1
 * 1 1 0 1 0
 * 1 1 0 1 1
 * 1 1 1 0 0
 * 1 1 1 0 1
 * 1 1 1 1 0
 * 1 1 1 1 1
 */
export const bitCountByLength = (length: number) => {
  return 2 ** (length - 2) * (length + 1);
};

/**
 * 同上
 * 求和
 */
export const bitSumByLength = (length: number) => {
  const left = 1 << (length - 1);
  const right = (1 << length) - 1;
  return ((left + right) / 2) * left;
};

/**
 * 计算幂
 * 同上
 */
export const bitPowByLength = (length: number): number => {
  if (length == 1) {
    return 0;
  }

  const size = 1 << (length - 1);

  let sum = ((length - 1) * size) / 2;

  for (let i = 1; i < length; i++) {
    sum += (i * size) / 2;
  }

  return sum;
};
