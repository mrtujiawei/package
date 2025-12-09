/**
 * 对象相关的工具函数
 *
 * utils.ts 中代码太长，拆分一下
 *
 * @filename packages/utils/src/utils/objectUtils.ts
 * @author Mr Prince
 * @date 2023-04-20 09:42:45
 */
import NullPointerException from '../customerErrors/NullPointerException';
import { toString } from './topLevelUtils';
import Types from './Types';

/**
 * 遍历自己的属性
 */
export const forEachOwnProperties = <T extends Object>(
  obj: T,
  callback: (value: T[keyof T], key: keyof T, context: T) => void
) => {
  // Object.keys 同理
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      return;
    }
    callback(obj[key], key, obj);
  }
};

/**
 * 判断是否是对象,排除null
 */
export const isObject = (object: unknown): boolean => {
  if (typeof {} != typeof object || toString(object) == Types.NULL) {
    return false;
  }
  return true;
};

/**
 * 判断是不是一个没有任何属性的对象
 */
export function isPlainObject(obj: any): boolean {
  if (!isObject(obj)) {
    return false;
  }
  for (const _ in obj) {
    return false;
  }
  return true;
}

/**
 * 要求对象必须不是 null
 */
export const requireNonNull = <T>(obj: T): T => {
  if (obj === null) {
    throw new NullPointerException();
  }
  return obj;
};
