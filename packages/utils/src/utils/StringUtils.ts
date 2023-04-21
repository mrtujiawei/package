/**
 * 字符串相关的工具函数
 * @filename packages/utils/src/utils/StringUtils.ts
 * @author Mr Prince
 * @date 2022-12-06 16:56:23
 */

import Types from './Types';
import { isInteger } from './utils';
import { toString } from './topLevelUtils';

/**
 * 遍历对象所有属性
 * 移除左右两边空格
 */
export function trim<T>(data: T): T {
  if (Types.isString(data)) {
    data = data.trim() as T;
  } else {
    for (let prop in data) {
      data[prop] = trim(data[prop]);
    }
  }
  return data;
}

/**
 * 不足位补0
 */
export function addZero(num: string | number, length: number = 2): string {
  return String(num).padStart(length, '0');
}

/**
 * 隐藏部分手机号
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
 */
export const numFormat = (num: number, delimiter: string = ','): string => {
  const result = num.toString().replace(/\B(?=(\d{3})+$)/g, delimiter);

  return result;
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
 */
export function hasDoubleByteWord(word: string) {
  return /[^\u0000-\u00FF]/.test(word);
}

/**
 * 是否包含中文，日文和韩文
 */
export function isChineseChar(word: string) {
  const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
  return reg.test(word);
}

/**
 * 是否包含全角符号
 */
export function isFullwidthChar(word: string) {
  const reg = /[\uFF00-\uFFEF]/;
  return reg.test(word);
}

/**
 * -xx-xx- 转为 大驼峰命名
 */
export const upperCamelCase = (str: string) => {
  return str
    .split('-')
    .map((word) => {
      if (0 == word.length) {
        return '';
      }
      return word[0].toUpperCase() + word.slice(1);
    })
    .join('');
};

/**
 * 判断字符串是否相等
 */
export function isEqual(a: string, b: string, options: {
  ignoreCase?: boolean
}) {
  a = a || '';
  b = b || '';
  if (options.ignoreCase) {
    return a.toUpperCase() == b.toUpperCase();
  }
  return a == b;
}

/**
 * 字符串预处理
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
 * 是否含有重复字符
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

