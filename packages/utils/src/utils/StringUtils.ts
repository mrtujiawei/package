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

