/**
 * 字符串相关的工具函数
 * @filename packages/utils/src/utils/StringUtils.ts
 * @author Mr Prince
 * @date 2022-12-06 16:56:23
 */

import Types from './Types';
import { isInteger } from './utils';
import { toString } from './topLevelUtils';
import { isAlphabet, isNumber } from './regexpUtils';

/**
 * 遍历对象所有属性
 * 移除左右两边空格
 *
 * @public
 */
export function trim<T>(data: T): T {
  if (Types.isString(data)) {
    data = data.trim() as unknown as T;
  } else {
    for (let prop in data) {
      data[prop] = trim(data[prop]);
    }
  }
  return data;
}

/**
 * 不足位补0
 *
 * @public
 */
export function addZero(num: string | number, length: number = 2): string {
  return String(num).padStart(length, '0');
}

/**
 * 隐藏部分手机号
 *
 * @public
 */
export const hiddenMobile = (mobile: string, hidden = '*'): string => {
  mobile = mobile || '';
  return mobile.replace(/\d{1,4}(?=(\d{4}$))/, ($0) => {
    return ''.padStart($0.length, hidden);
  });
};

/**
 * 数字格式化
 * 1234 => 1,234
 *
 * @public
 */
export const numFormat = (num: number, delimiter: string = ','): string => {
  const result = num.toString().replace(/\B(?=(\d{3})+$)/g, delimiter);

  return result;
};

/**
 * 首字母大写
 */
export const capitalize = <T extends string>(str: T): Capitalize<T> => {
  if (!str || str[0].toUpperCase() == str[0]) {
    return str as Capitalize<T>;
  }
  return (str[0].toUpperCase() + str.slice(1)) as Capitalize<T>;
};

/**
 * 首字母小写
 */
export const uncapitalize = <T extends string>(str: T): Uncapitalize<T> => {
  if (!str || str[0].toLowerCase() == str[0]) {
    return str as Uncapitalize<T>;
  }
  return (str[0].toLowerCase() + str.slice(1)) as Uncapitalize<T>;
};

/**
 * 对象转字符串
 * 不是为了格式化成json,只是为了可读,可保存
 * 会忽略循环引用的属性
 *
 * 1. 如果是字符串，加上标识直接返回
 * 2. 如果是undefined 或者 null，改成字符串
 * 3. 如果是Error,打印message 和 stack
 * 4. 如果是Date类型，返回标识和时间戳
 * 5. 如果是数组，加上标识,遍历下标,加上length
 * 6. 如果是对象, 加上标识,遍历属性
 *
 * @public
 */
export const objectToString = (
  data: any,
  references = new Set<any>()
): string => {
  // 出现循环引用
  if (references.has(data)) {
    return '(Circular Structure)';
  }

  const paramType = toString(data);

  const normalTypes = [Types.NULL, Types.NUMBER, Types.UNDEFINED, Types.SYMBOL];

  // 没必要特殊处理的类型,直接 转换成字符串
  if (normalTypes.includes(paramType)) {
    return String(data);
  }

  // 给 string 类型的加上字符串标识
  if (Types.STRING == paramType) {
    return `"${data}"`;
  }

  if (Types.FUNCTION == paramType) {
    return `function ${data.name}() { [code] }`;
  }

  if (Types.ERROR == paramType) {
    return `${data.message}: \n${data.stack}`;
  }

  if (Types.DATE == paramType) {
    return `Date(${data.getTime()})`;
  }

  // 以上类型都不满足
  // 说明是特殊的类型,添加到引入
  references.add(data);

  // 处理数组
  if (Types.ARRAY == paramType) {
    const result = [];
    result.push('[');

    for (let prop in data) {
      if (isInteger(prop)) {
        result.push(`${objectToString(data[prop], references)}, `);
      } else {
        result.push(`${prop}: ${data[prop]}, `);
      }
    }
    result.push(`length: ${data.length}`, ']');
    return result.join('');
  }

  // 处理对象
  if (Types.OBJECT == paramType) {
    const result = [];
    result.push('{ ');
    for (let prop in data) {
      result.push(`${prop} => ${objectToString(data[prop], references)}, `);
    }

    // 移掉最后多余的 逗号
    if (1 < result.length) {
      result[result.length - 1] = result[result.length - 1].slice(0, -2);
    }

    result.push(' }');
    return result.join('');
  }

  // 降级方案
  try {
    return JSON.stringify(data);
  } catch (e) {
    return data.toString();
  }
};

/**
 * 是否包含双字节字符
 *
 * @public
 */
export function hasDoubleByteWord(word: string) {
  return /[^\u0000-\u00FF]/.test(word);
}

/**
 * 是否包含中文，日文和韩文
 *
 * @public
 */
export function isChineseChar(word: string) {
  const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
  return reg.test(word);
}

/**
 * 是否包含全角符号
 *
 * @public
 */
export function isFullwidthChar(word: string) {
  const reg = /[\uFF00-\uFFEF]/;
  return reg.test(word);
}

/**
 * -xx-xx- 转为 大驼峰命名
 *
 * @public
 */
export const upperCamelCase = (str: string) => {
  return str
    .split('-')
    .map((word) => {
      return capitalize(word);
    })
    .join('');
};

/**
 * 判断字符串是否相等
 *
 * @public
 */
export function isEqual(
  a: string,
  b: string,
  options: {
    ignoreCase?: boolean;
  }
) {
  a = a || '';
  b = b || '';
  if (options.ignoreCase) {
    return a.toUpperCase() == b.toUpperCase();
  }
  return a == b;
}

/**
 * 字符串预处理
 *
 * @private
 */
const manacherPreprocess = (str: string, prefix: string, padding: string) => {
  const n = str.length;
  const result: string[] = new Array(n * 2 + 2);

  result[0] = prefix;
  for (let i = 0; i < n; i++) {
    const index = i << 1;
    result[index + 1] = padding;
    result[index + 2] = str[i];
  }
  result[n * 2 + 1] = padding;

  return result;
};

/**
 * manacher 马拉车算法
 *
 * @public
 * @param str 字符串
 * @param prefix 前缀字符，不存在str中
 * @param padding 填充字符，不存在str中
 *
 * @returns 最长回文子串的长度
 */
export const manacher = (
  str: string,
  prefix: string = '^',
  padding: string = '#'
) => {
  const chars = manacherPreprocess(str, prefix, padding);

  // 解决重复计算问题
  const radius = new Array(chars.length).fill(0);

  let center = 0;
  let right = 0;

  let maxLen = 1;
  let maxCenter = 0;

  for (let i = 1; i < chars.length; i++) {
    // mirror 是 i 关于 center 的对称点
    // 有: (i + mirror) / 2 = center
    let mirror = 2 * center - i;

    // 如果在回文范围外， 需要从 1 开始计算
    // 否则 根据和对称点相同
    // 对称点可能超出当前回文串的范围，需要根据 right - i 来判断
    radius[i] = i >= right ? 1 : Math.min(right - i, radius[mirror]);
    while (chars[i + radius[i]] == chars[i - radius[i]]) {
      radius[i]++;
    }
    if (radius[i] + i > right) {
      right = radius[i] + i;
      center = i;
    }
    if (maxLen < radius[i]) {
      maxLen = radius[i];
      maxCenter = i;
    }
  }

  // TODO 返回值可以更通用一点
  let start = (maxCenter - radius[maxCenter]) >> 1;

  return str.substring(start, start + maxLen - 1);
};

/**
 * @public
 *
 * 判断字符串是否是回文
 */
export const isPalindrome = (str: string) => {
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    if (str[left] != str[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
};

/**
 * 是否含有重复字符
 *
 * @public
 */
export function hasRepeatChar(str: string | string[]) {
  const set = new Set<string>();

  for (const ch of str) {
    // 内循环是为了处理字符数组中每一项有多个字符的情况
    for (const c of ch) {
      if (set.has(c)) {
        return true;
      } else {
        set.add(c);
      }
    }
  }

  return false;
}

/**
 * 判断是否是元音字符
 * 字符串必须是 'a' | 'e' | 'i' | 'o' | 'u' | 'A' | 'E' | 'I' | 'O' | 'U'
 */
export const isVowel = (ch: string) => {
  return /^(a|e|i|o|u)$/i.test(ch);
};

/**
 * 字符串 转 union
 */
export const unicode = (str: string) => {
  return Object.values(str).map((ch) =>
    ch.charCodeAt(0).toString(16).padStart(4, '0')
  );
};

/**
 * unicode 转字符数组
 */
export const ununicode = (code: number[]) => {
  return code.map((value) => String.fromCharCode(value));
};

/**
 * 检查全字母句
 * 包含 a-z 所有字符
 * 不区分大小写
 */
export const checkPangram = (str: string) => {
  return str.match(/([a-z])(?!.*\1)/gi)?.length == 26;
};

const mapBigrams = (str: string) => {
  const bigrams = new Map<string, number>();
  for (let i = 0; i < str.length - 1; i++) {
    const bigram = str.substring(i, i + 2);
    const count = bigrams.get(bigram);
    bigrams.set(bigram, (count || 0) + 1);
  }
  return bigrams;
};

const countCommonBigrams = (bigrams: Map<string, number>, str: string) => {
  let count = 0;
  for (let i = 0; i < str.length - 1; i++) {
    const bigram = str.substring(i, i + 2);
    if (bigrams.has(bigram)) count++;
  }
  return count;
};

/**
 * 相似性
 */
export const diceCoefficient = (a: string, b: string) => {
  if (a == b) {
    return 1;
  }

  if (a.length < 2 || b.length < 2) {
    return 0;
  }

  const bigramsA = mapBigrams(a);

  const lengthA = a.length - 1;
  const lengthB = b.length - 1;

  const dice = (2 * countCommonBigrams(bigramsA, b)) / (lengthA + lengthB);

  return Math.round(dice * 100) / 100;
};

/**
 * 编辑距离 (最小)
 *
 * 通过 0 1 2 三种操作，将 a 转化成 b
 * 0. 删除
 * 1. 插入
 * 2. 修改
 */
export const levenshteinDistance = (word1: string, word2: string) => {
  let dp = Array.from({ length: word1.length + 1 }, () =>
    Array.from({ length: word2.length + 1 }, () => 0)
  );

  for (let i = 1; i <= word1.length; i++) {
    dp[i][0] = i;
  }

  for (let j = 1; j <= word2.length; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= word1.length; i++) {
    for (let j = 1; j <= word2.length; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }

  return dp[word1.length][word2.length];
};

/**
 * 字符串匹配
 *
 * 感觉和 kmp 相似
 *
 * @returns - 起始下标, -1 -> 没找到
 */

export const boyerMoore = (str: string, pattern: string) => {
  const badMatchTable = buildBadMatchTable(pattern);
  let offset = 0;
  const patternLastIndex = pattern.length - 1;
  const maxOffset = str.length - pattern.length;
  while (offset <= maxOffset) {
    let scanIndex = 0;
    // 普通的字符串匹配
    while (pattern[scanIndex] === str[scanIndex + offset]) {
      if (scanIndex === patternLastIndex) {
        return offset;
      }
      scanIndex++;
    }
    const badMatchString = str[offset + patternLastIndex];
    if (badMatchTable[badMatchString]) {
      // 匹配到了末尾的字符，确定至少移动这个距离
      // 减少匹配次数
      offset += badMatchTable[badMatchString];
    } else {
      offset++;
    }
  }
  return -1;
};

/**
 * 只是记录最后一个元素出现的位置
 */
const buildBadMatchTable = (str: string) => {
  const tableObj: Record<string, number> = {};
  const strLength = str.length;
  for (let i = 0; i < strLength - 1; i++) {
    tableObj[str[i]] = strLength - 1 - i;
  }
  if (tableObj[str[strLength - 1]] === undefined) {
    tableObj[str[strLength - 1]] = strLength;
  }
  return tableObj;
};

/**
 * 从字符串中获取所有的数字
 */
export const getNumberFromString = (str: string) => {
  return str.split('').filter((item) => {
    return isNumber(item);
  });
};

/**
 * 获取字符串中的所有英文字母
 * 忽略大小写
 */
export const getAlphabetFromString = (str: string) => {
  return str.split('').filter((item) => {
    return isAlphabet(item);
  });
};

/**
 * 判断是否包含空格
 */
export const hasSpace = (str: string) => {
  let has = false;
  for (const ch of str) {
    if (ch == ' ') {
      has = true;
      break;
    }
  }

  return has;
};
