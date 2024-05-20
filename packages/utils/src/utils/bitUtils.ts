/**
 * 位运算相关工具函数
 *
 * @filename packages/utils/src/utils/bitUtils.ts
 * @author Mr Prince
 * @date 2023-04-20 10:34:46
 */

/**
 * n的二级制, 从右数的第 k 位的数值
 * @param n >= 0
 * @param k >= 0, 等于0表示最后一位
 */
export function bit(n: number, k: number): 0 | 1 {
  if (((n >> k) & 1) == 1) {
    return 1;
  }
  return 0;
}

/**
 * n的二级制, 从右数的第 k 位的数值是否为1
 * @param n >= 0
 * @param k >= 0, 等于0表示最后一位
 */
export function is1FromRightK(n: number, k: number) {
  return bit(n, k) == 1;
}

/**
 * n的二级制, 从右数的第 k 位的数值设置为1
 * @param n >= 0
 * @param k >= 0, 等于0表示最后一位
 */
export function set1FromRightK(n: number, k: number) {
  return n | (1 << k);
}

/**
 * 将最后一位 1 设置为0
 * @param n > 0
 */
export function set0FromRight(n: number) {
  return n & (n - 1);
}

/**
 * 判断 n 是否是2的幂
 */
export function is2N(n: number) {
  return (n & (n - 1)) == 0;
}

/**
 * 统计 n 的二进制中有多少个 1
 */
export function bitCount(n: number) {
  let count = 0;

  while (n > 0) {
    count += n & 1;
    n >>= 1;
  }

  return count;
}

/**
 * 二进制码转格雷码
 * 看不懂自己查文档
 */
export const binaryCodeToBinaryGrayCode = (n: number) => {
  return n ^ (n >> 1);
};

/**
 * 生成长度为 n 的 二进制格雷码
 * 看不懂自己查文档
 */
export function binaryGrayCode(n: number) {
  const codes: number[] = new Array(2 ** n);
  for (let i = 0; i < codes.length; i++) {
    codes[i] = binaryCodeToBinaryGrayCode(i);
  }
  return codes;
}

/**
 * 格雷码转二进制
 * 看不懂自己查文档
 */
export function binaryGrayCodeToBinaryCode(grayCode: number) {
  let result = 0;

  for (let i = 29; i >= 0; i--) {
    const g = (result & (1 << (i + 1))) >> 1;
    const b = grayCode & (1 << i);
    result |= g ^ b;
  }

  return result;
}

/**
 * 前导 0 的个数
 */
export const numberOfLeadingZero = (num: number) => {
  if (num < 0) {
    return 0;
  }
  const bits = num.toString(2);
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] == '1') {
      return 32 - (bits.length - i);
    }
  }
  return 32;
};

/**
 * [0, num - 1] 的二进制中 1 的个数
 */
export const bitCountFromOne = (num: number) => {
  if (num == 0) {
    return 0;
  }
  return Math.pow(2, num - 1) * num;
};
