/**
 * 处理日期的工具类，只处理Date类型的，因为转Date类型太麻烦了
 * @filename: DateTimeTool.ts
 * @author: Mr Prince
 * @date: 2021-05-07 20:42:28
 */
import { addZero, } from './utils';

class DateTimeTool {
  /**
   * 格式化时间,默认当前时间
   */
  static timeFormat(date: Date = new Date(), delimiter: string = ':'): string {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [hour, minute, second].map(num => addZero(num)).join(delimiter);
  }

  /**
   * 格式化日期,默认今天
   */
  static dateFormat(date: Date = new Date(), delimiter: string = '-'): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day].map(num => addZero(num)).join(delimiter);
  }

  /**
   * 格式化日期时间,默认今天
   */
  static dateTimeFormat(date: Date = new Date(), dateDelimiter: string = '-', timeDelimiter: string = ':'): string {
    const day = DateTimeTool.dateFormat(date, dateDelimiter)
    const time = DateTimeTool.timeFormat(date, timeDelimiter);
    return `${day} ${time}`;
  }

  /**
   * 时间戳转时间字符串
   */
  static timestampToTime(timestamp: number, delimiter: string = ':') {
    return DateTimeTool.timeFormat(new Date(timestamp), delimiter);
  }

  /**
   * 时间戳转日期字符串
   */
  static timestampToDate(timestamp: number, delimiter: string = '-') {
    return DateTimeTool.dateFormat(new Date(timestamp), delimiter);
  }

  /**
   * 时间戳转日期时间字符串
   */
  static timestampToDateTime(timestamp: number, dateDelimiter = '-', timeDelimiter = ':') {
    return DateTimeTool.dateTimeFormat(new Date(timestamp), dateDelimiter, timeDelimiter);
  }

  /**
   * 获取n天以前时间和当前日期时间
   */
  static getNthDayBefore(n: number, end = new Date()): Date[] {
    const start = new Date();
    start.setTime(start.getTime() - 1000 * 60 * 60 * 24 * n);
    return [start, end];
  }

  /**
   * 获取n天以后时间
   */
  static getNthDayAfter(n: number, before = new Date()): Date[] {
    const after = new Date(before);
    after.setDate(before.getDate() + n);

    return [before, after];
  }

  /**
   * 获取n小时之前到当前时间
   */
  static getNthHourBefore(n: number, end = new Date()): Date[] {
    const start = new Date();
    start.setTime(start.getTime() - 1000 * 60 * 60 * n);
    return [start, end];
  }

  /**
   * 获取n月以前时间到当前月时间
   */
  static getNthMonthBefore(n: number = 1, end = new Date()): Date[] {
    const start = new Date();
    start.setMonth(start.getMonth() - n);
    return [start, end];
  }

  /**
   * 是否是闰年
   */
  static isLeapYear(date: Date = new Date()): boolean {
    const year = date.getFullYear();
    if ((0 == year % 4 && 0 != year % 100) || 0 == year % 400) {
      return true;
    }
    return false;
  }

  /**
   * 两个日期相差的时间戳
   */
  static diffTimestamp(start: Date | number, end: Date | number): number {
    const timeStart = new Date(start).getTime();
    const timeEnd = new Date(end).getTime();
    return Math.abs(timeEnd - timeStart);
  }

  /**
   * 两个日期相差的秒数
   */
  static diffSeconds(start: Date | number, end: Date | number): number {
    const timeStamp = DateTimeTool.diffTimestamp(start, end);
    return Math.floor(timeStamp / 1000);
  }

  /**
   * 两个日期相差的分钟数
   */
  static diffMinutes(start: Date | number, end: Date | number): number {
    const seconds = DateTimeTool.diffSeconds(start, end);
    return Math.floor(seconds / 60);
  }

  /**
   * 两个日期相差的小时数
   */
  static diffHours(start: Date | number, end: Date | number): number {
    const minutes = DateTimeTool.diffMinutes(start, end);
    return Math.floor(minutes / 60);
  }

  /**
   * 两个日期之间相差多少天
   */
  static diffDays(start: Date | number, end: Date | number): number {
    const hours = DateTimeTool.diffHours(start, end);
    return Math.floor(hours / 24);
  }

  /**
   * 设置到当前天的开始
   */
  static toDayBegin(date: Date): Date {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  /**
   * 设置到当前的结束
   */
  static toDayEnd(date: Date): Date {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);
    return date;
  }

  /**
   * 往后加几天
   */
  static addDays(date: Date | number, days: number): Date {
    const result = new Date(date);
    result.setDate(new Date(date).getTime() + days);
    return result;
  }

  /**
   * 获取当周的日期范围
   */
  static getCurrentWeek(date: Date | number, changeTime = true): Date[] {
    const start = new Date(date);
    start.setDate(start.getDate() - (start.getDay() - 1));

    const end = new Date(date);
    end.setDate(start.getDate() + (6 - end.getDay()));

    if (changeTime) {
      DateTimeTool.toDayBegin(start);
      DateTimeTool.toDayEnd(end);
    }

    return [start, end];
  }
}

export default DateTimeTool;
