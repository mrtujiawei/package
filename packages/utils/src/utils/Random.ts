/**
 * 生成随机值
 * @filename: Random.ts
 * @author: Mr Prince
 * @date: 2021-10-27 15:46:30
 * @since 1.2.4
 */

import { addZero } from './StringUtils';

class Random {
  /**
   * 检查长度是否合法
   */
  private static checkLength(length: number) {
    if (0 >= length) {
      throw new Error('Length is not valid');
    }
  }

  /**
   * 检查范围是否合法
   */
  private static checkRange(min: number, max: number) {
    if (max == min) {
      throw new Error(`Number min:${min} is equal to max: ${max}`);
    }
  }

  /**
   * 生成范围内的随机整数: [min, max)
   */
  static getRandomNumber = (min: number, max: number): number => {
    Random.checkRange(min, max);

    const diff = Math.random() * (max - min);

    return min + Math.floor(diff);
  };

  /**
   * 生成范围内的随机数: [min, max)
   */
  static getRandomFloat = (min: number, max: number): number => {
    Random.checkRange(min, max);

    const diff = Math.random() * (max - min);

    return min + diff;
  };

  /**
   * 生成随机boolean值
   * @param probability - 为true的概率
   */
  static getRandomBoolean = (probability = 0.5): boolean => {
    return probability > Math.random();
  };

  /**
   * 生成随机大写字母
   */
  static getRandomUppercaseLetter = (): string => {
    const code = Random.getRandomNumber(65, 91);
    return String.fromCharCode(code);
  };

  /**
   * 生成随机大写字符串
   */
  static getRandomUppercaseString = (length: number): string => {
    Random.checkLength(length);

    const result: string[] = new Array(length);

    for (let i = 0; i < length; i++) {
      result[i] = Random.getRandomUppercaseLetter();
    }

    return result.join('');
  };

  /**
   * 生成小写字母
   */
  static getRandomLowercaseLetter = (): string => {
    const code = Random.getRandomNumber(97, 123);
    return String.fromCharCode(code);
  };

  /**
   * 生成随机小写字符串
   */
  static getRandomLowercaseString = (length: number): string => {
    Random.checkLength(length);

    const result: string[] = new Array(length);

    for (let i = 0; i < length; i++) {
      result[i] = Random.getRandomLowercaseLetter();
    }

    return result.join('');
  };

  /**
   * 生成英文字符串, 满足正则表达式 /[a-zA-Z]{length}/
   */
  static getRandomAlphabetString = (length: number): string => {
    Random.checkLength(length);

    const result = new Array(length);
    for (let i = 0; i < length; i++) {
      result[i] = Random.getRandomBoolean()
        ? Random.getRandomUppercaseLetter()
        : Random.getRandomLowercaseLetter();
    }
    return result.join('');
  };

  /**
   * 随机字符串,满足正则表达式 /[a-zA-Z0-9]{length}/
   */
  static getRandomString = (length: number): string => {
    if (length <= 0) {
      throw new Error('String length is not valid');
    }

    type Item = string | number;

    const result: Item[] = new Array(length);
    for (let i = 0; i < length; i++) {
      let item: Item = Random.getRandomNumber(-1, 2);
      if (-1 == item) {
        item = Random.getRandomLowercaseLetter();
      } else if (0 == item) {
        item = Random.getRandomNumber(0, 10);
      } else if (1 == item) {
        item = Random.getRandomUppercaseLetter();
      }
      result[i] = item;
    }

    return result.join('');
  };

  /**
   * 生成一个随机ID,类似UUID的形式,但不保证不重复
   */
  static getRandomID = (): string => {
    const head = Random.getRandomString(8).toLowerCase();
    const tail = Random.getRandomString(12).toLowerCase();
    const range: string[] = [];
    const rangeSize = 1 << 16;
    let time = new Date().getTime();
    for (let i = 0; i < 3; i++) {
      let timeItem = time % rangeSize;
      time -= timeItem;
      time /= rangeSize;
      range.push(addZero(timeItem.toString(16), 4));
    }
    return `${head}-${range.join('-')}-${tail}`;
  };

  /**
   * 生成随机的一个 #rrggbb 的颜色
   */
  static getRandomRGB = (): string => {
    let color = '#';

    for (let i = 0; i < 3; i++) {
      const value = Random.getRandomNumber(0, 1 << 8);
      color += value.toString(16).padStart(2, '0');
    }

    return color;
  };

  /**
   * 生成随机带 alpha 的颜色
   */
  static getRandomRGBA = () => {
    const rgba: number[] = [];
    for (let i = 0; i < 4; i++) {
      rgba.push(Random.getRandomNumber(0, 1 << 8));
    }

    rgba[3] /= 1 << 8;

    return `rgba(${rgba.join(',')})`;
  };
}

export default Random;
