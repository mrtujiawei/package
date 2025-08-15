/**
 * 处理日期的工具类，只处理Date类型的，因为转Date类型太麻烦了
 * @filename: DateTimeTool.ts
 * @author: Mr Prince
 * @date: 2021-05-07 20:42:28
 */
import { addZero } from './StringUtils';

class DateTimeTool {
  /**
   * 1微秒的纳秒数
   */
  private static readonly nanosecondsOfOneMicrosecond = 1000;

  /**
   * 1毫秒的微秒数
   */
  private static readonly microsecondsOfOneMillisecond = 1000;

  /**
   * 一秒钟的毫秒数
   * 1s = 1000ms
   */
  private static readonly millisecondsOfOneSecond = 1000;

  /**
   * 一分钟的秒数
   */
  private static readonly secondsOfOneMinute = 60;

  /**
   * 一小时的分钟数
   */
  private static readonly minutesOfOneHour = 60;

  /**
   * 一天的小时数
   */
  private static readonly hoursOfOneDay = 24;

  /**
   * 一毫秒的纳秒数
   */
  private static readonly nanosecondsOfOneMilliseocnd =
    DateTimeTool.nanosecondsOfOneMicrosecond *
    DateTimeTool.microsecondsOfOneMillisecond;

  /**
   * 一分钟的毫秒数
   * 1m = 60s
   */
  private static readonly millisecondsOfOneMinute =
    DateTimeTool.millisecondsOfOneSecond * DateTimeTool.secondsOfOneMinute;

  /**
   * 一小时的毫秒数
   * 1h = 60m
   */
  private static readonly millisecondsOfOneHour =
    DateTimeTool.millisecondsOfOneMinute * DateTimeTool.minutesOfOneHour;

  /**
   * 一天的毫秒数
   * 1d = 24h
   */
  private static readonly millisecondsOfOneDay =
    DateTimeTool.millisecondsOfOneHour * DateTimeTool.hoursOfOneDay;

  /**
   * 解析日期时间
   * @todo 遇到没有碰到过的格式时，更新parse
   * @returns 时间戳
   */
  static parse(date: string) {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4}$/.test(date)) {
      // 2022-08-09T01:43:12.000+0000
      // utc时间. 毫秒数[+-]小时分钟偏移
      // 如果是东八区，小时数需要+8
      // 小时偏移不能超过23，分钟偏移不能超过60
      const [udate, rest] = date.split('T');
      const [year, month, day] = udate.split('-').map(Number);
      const [utime, msAndOffset] = rest.split('.');
      const [hour, minute, second] = utime.split(':').map(Number);
      const [ms, offsetType, offsetValue] = msAndOffset.split(/([+-])/);

      const formatedDate = new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        second,
        Number(ms)
      );

      const hourOffset = offsetValue.slice(0, 2);
      const minuteOffset = offsetValue.slice(2);

      // 计算utc的偏移量
      if ('+' == offsetType) {
        formatedDate.setHours(formatedDate.getHours() - Number(hourOffset));
        formatedDate.setMinutes(
          formatedDate.getMinutes() - Number(minuteOffset)
        );
      } else if ('-' == offsetType) {
        formatedDate.setHours(formatedDate.getHours() + Number(hourOffset));
        formatedDate.setMinutes(
          formatedDate.getMinutes() + Number(minuteOffset)
        );
      }

      // 计算utc到本地时间的偏移量

      // 时区偏移量
      const timezoneOffset = formatedDate.getTimezoneOffset();
      formatedDate.setMinutes(formatedDate.getMinutes() - timezoneOffset);

      return formatedDate.getTime();
    } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(date)) {
      // 2022-08-09T02:51:36.291Z
      const [udate, rest] = date.split('T');
      const [year, month, day] = udate.split('-').map(Number);
      const [utime, msAndOffset] = rest.split('.');
      const [hours, minutes, seconds] = utime.split(':').map(Number);
      const [ms] = msAndOffset.split('Z');

      const formatedDate = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes,
        seconds,
        Number(ms)
      );

      // 计算utc到本地时间的偏移量

      // 时区偏移量
      const timezoneOffset = formatedDate.getTimezoneOffset();
      formatedDate.setMinutes(formatedDate.getMinutes() - timezoneOffset);

      return formatedDate.getTime();
    } else if (
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{9}[+-]\d{2}:\d{2}$/.test(date)
    ) {
      // 2021-08-13T14:20:18.992847200-04:00
      const [udate, rest] = date.split('T');
      const [year, month, day] = udate.split('-').map(Number);
      const [utime, msAndOffset] = rest.split('.');
      const [hours, minutes, seconds] = utime.split(':').map(Number);
      const [ns, offsetType, offsetValue] = msAndOffset.split(/([+-])/);
      const ms = Math.floor(
        Number(ns) / DateTimeTool.nanosecondsOfOneMilliseocnd
      );

      const formatedDate = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes,
        seconds,
        ms
      );

      const [hourOffset, minuteOffset] = offsetValue.split(':').map(Number);

      // 计算utc的偏移量
      if ('+' == offsetType) {
        formatedDate.setHours(formatedDate.getHours() - Number(hourOffset));
        formatedDate.setMinutes(
          formatedDate.getMinutes() - Number(minuteOffset)
        );
      } else if ('-' == offsetType) {
        formatedDate.setHours(formatedDate.getHours() + Number(hourOffset));
        formatedDate.setMinutes(
          formatedDate.getMinutes() + Number(minuteOffset)
        );
      }

      // 计算utc到本地时间的偏移量

      // 时区偏移量
      const timezoneOffset = formatedDate.getTimezoneOffset();
      formatedDate.setMinutes(formatedDate.getMinutes() - timezoneOffset);

      return formatedDate.getTime();
    } else if (/^\d{4}[/-]\d{2}[/-]\d{2} \d{2}:\d{2}:\d{2}$/.test(date)) {
      // 2022/09/09 13:53:20 或者 2022-09-09 13:53:20
      const [udate, utime] = date.split(' ');
      const [year, month, day] = udate.split(/[/-]/).map(Number);
      const [hours, minutes, seconds] = utime.split(':').map(Number);
      const formatedDate = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes,
        seconds,
        0
      );
      return formatedDate.getTime();
    } else if (/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}[+-]\d{4}$/.test(date)) {
      // 1992/02/12 12:23:22+0100
      const [udate, rest] = date.split(' ');
      const [year, month, day] = udate.split('/').map(Number);
      const [utime, offsetType, offsetValue] = rest.split(/([+-])/);
      const [hours, minutes, seconds] = utime.split(':').map(Number);

      const formatedDate = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes,
        seconds,
        0
      );

      const hourOffset = offsetValue.slice(0, 2);
      const minuteOffset = offsetValue.slice(2, 4);

      // 计算utc的偏移量
      if ('+' == offsetType) {
        formatedDate.setHours(formatedDate.getHours() - Number(hourOffset));
        formatedDate.setMinutes(
          formatedDate.getMinutes() - Number(minuteOffset)
        );
      } else if ('-' == offsetType) {
        formatedDate.setHours(formatedDate.getHours() + Number(hourOffset));
        formatedDate.setMinutes(
          formatedDate.getMinutes() + Number(minuteOffset)
        );
      }

      // 计算utc到本地时间的偏移量

      // 时区偏移量
      const timezoneOffset = formatedDate.getTimezoneOffset();
      formatedDate.setMinutes(formatedDate.getMinutes() - timezoneOffset);

      return formatedDate.getTime();
    }

    // throw new Error('未成功匹配');
    return new Date(date).getTime();
  }

  /**
   * 格式化时间,默认当前时间
   */
  static timeFormat(date: Date = new Date(), delimiter: string = ':'): string {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return [hour, minute, second].map((num) => addZero(num)).join(delimiter);
  }

  /**
   * 格式化日期,默认今天
   */
  static dateFormat(date: Date = new Date(), delimiter: string = '-'): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day].map((num) => addZero(num)).join(delimiter);
  }

  /**
   * 格式化日期时间,默认今天
   */
  static dateTimeFormat(
    date: Date = new Date(),
    dateDelimiter: string = '-',
    timeDelimiter: string = ':'
  ): string {
    const day = DateTimeTool.dateFormat(date, dateDelimiter);
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
  static timestampToDateTime(
    timestamp: number,
    dateDelimiter = '-',
    timeDelimiter = ':'
  ) {
    return DateTimeTool.dateTimeFormat(
      new Date(timestamp),
      dateDelimiter,
      timeDelimiter
    );
  }

  /**
   * 获取n天以前时间和当前日期时间
   */
  static getNthDayBefore(n: number, end = new Date()): Date[] {
    const start = new Date();
    start.setTime(start.getTime() - DateTimeTool.millisecondsOfOneDay * n);
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
    start.setTime(start.getTime() - DateTimeTool.millisecondsOfOneHour * n);
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
   *
   * 能被4整除且不能被100整除
   * 或者能被400整除
   */
  static isLeapYear(date: Date = new Date()): boolean {
    const year = date.getFullYear();
    return (0 == year % 4 && 0 != year % 100) || 0 == year % 400;
  }

  /**
   * 是否是闰年的 2-29
   */
  static isLeapDay(date: Date = new Date()): boolean {
    return (
      this.isLeapYear(date) && date.getMonth() + 1 == 2 && date.getDate() == 29
    );
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
    return DateTimeTool.getSecondsFromMilliseconds(timeStamp);
  }

  /**
   * 两个日期相差的分钟数
   */
  static diffMinutes(start: Date | number, end: Date | number): number {
    const seconds = DateTimeTool.diffSeconds(start, end);
    return Math.floor(seconds / DateTimeTool.secondsOfOneMinute);
  }

  /**
   * 两个日期相差的小时数
   */
  static diffHours(start: Date | number, end: Date | number): number {
    const minutes = DateTimeTool.diffMinutes(start, end);
    return Math.floor(minutes / DateTimeTool.minutesOfOneHour);
  }

  /**
   * 两个日期之间相差多少天
   */
  static diffDays(start: Date | number, end: Date | number): number {
    const hours = DateTimeTool.diffHours(start, end);
    return Math.floor(hours / DateTimeTool.hoursOfOneDay);
  }

  /**
   * 设置到当前秒的开始
   */
  static toSecondBegin(date: Date): Date {
    date.setMilliseconds(0);
    return date;
  }

  /**
   * 设置到当前分钟的开始
   */
  static toMinuteBegin(date: Date): Date {
    date.setSeconds(0);
    return DateTimeTool.toSecondBegin(date);
  }

  /**
   * 设置到当前小时的开始
   */
  static toHourBegin(date: Date): Date {
    date.setMinutes(0);
    return DateTimeTool.toMinuteBegin(date);
  }

  /**
   * 设置到当前天的开始
   */
  static toDayBegin(date: Date): Date {
    date.setHours(0);
    return DateTimeTool.toHourBegin(date);
  }

  /**
   * 当月开始时间
   */
  static toMonthBegin(date: Date): Date {
    date.setDate(1);
    return DateTimeTool.toDayBegin(date);
  }

  /**
   * 今年开始时间
   */
  static toYearBegin(date: Date): Date {
    date.setMonth(0);
    return DateTimeTool.toMonthBegin(date);
  }

  /**
   * 本世纪开始时间
   */
  static toCenturyBegin(date: Date): Date {
    const year = date.getFullYear();
    date.setFullYear(year - (year % 100));
    return DateTimeTool.toYearBegin(date);
  }

  /**
   * 当前秒结束
   */
  static toSecondEnd(date: Date): Date {
    date.setMilliseconds(DateTimeTool.millisecondsOfOneSecond - 1);
    return date;
  }

  /**
   * 当前分钟结束
   */
  static toMinuteEnd(date: Date): Date {
    date.setSeconds(DateTimeTool.secondsOfOneMinute - 1);
    return DateTimeTool.toSecondEnd(date);
  }

  /**
   * 当前小时结束
   */
  static toHourEnd(date: Date): Date {
    date.setHours(DateTimeTool.minutesOfOneHour - 1);
    return DateTimeTool.toMinuteEnd(date);
  }

  /**
   * 设置到当前天的结束
   */
  static toDayEnd(date: Date): Date {
    date.setHours(DateTimeTool.hoursOfOneDay - 1);
    return DateTimeTool.toHourEnd(date);
  }

  /**
   * 这知道当前月的结束
   */
  static toMonthEnd(date: Date): Date {
    date.setMonth(date.getMonth() + 1);
    date.setDate(-1);
    return DateTimeTool.toDayEnd(date);
  }

  static toYearEnd(date: Date): Date {
    return DateTimeTool.toMonthEnd(date);
  }

  /**
   * 往后加几天
   * @param date 需要修改的 Date 或者 milliseconds
   * @param days 改变的天数
   */
  static addDays(date: Date | number, days: number): Date {
    const result = new Date(date);
    result.setDate(new Date(date).getDate() + days);
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

  /**
   * 毫秒数转秒数
   * 不足1秒直接舍弃
   * @param milliseconds 毫秒数
   */
  static getSecondsFromMilliseconds(milliseconds: number) {
    milliseconds = Math.abs(milliseconds);
    return Math.floor(milliseconds / DateTimeTool.millisecondsOfOneSecond);
  }

  /**
   * 毫秒数转分钟数
   * 不足1分钟直接舍弃
   * @param milliseconds 毫秒数
   */
  static getMinutesFromMilliseconds(milliseconds: number) {
    const seconds = DateTimeTool.getSecondsFromMilliseconds(milliseconds);
    return Math.floor(seconds / DateTimeTool.secondsOfOneMinute);
  }

  /**
   * 毫秒数转小时数
   * 不足1小时直接舍弃
   * @param milliseconds 毫秒数
   */
  static getHoursFromMilliseconds(milliseconds: number) {
    const minutes = DateTimeTool.getMinutesFromMilliseconds(milliseconds);
    return Math.floor(minutes / DateTimeTool.minutesOfOneHour);
  }

  /**
   * 毫秒数转天数
   * 不足一天直接舍弃
   * @param milliseconds 毫秒数
   */
  static getDayCountFromMilliseconds(milliseconds: number) {
    const hours = DateTimeTool.getHoursFromMilliseconds(milliseconds);
    return Math.floor(hours / DateTimeTool.hoursOfOneDay);
  }

  /**
   * 毫秒数格式化
   * @param milliseconds 毫秒数
   * @returns hh:mm:ss
   */
  static millisecondsFormat(milliseconds: number) {
    return DateTimeTool.secondsFormat(
      Math.floor(milliseconds / DateTimeTool.millisecondsOfOneSecond)
    );
  }

  /**
   * 秒数格式化
   *
   * @param seconds 秒数 seconds >= 0
   * @returns hh:mm:ss
   */
  static secondsFormat(seconds: number) {
    seconds = Math.floor(seconds);
    if (seconds < 0) {
      seconds = 0;
    }
    const second = seconds % DateTimeTool.secondsOfOneMinute;
    seconds -= second;
    const minute = seconds % DateTimeTool.minutesOfOneHour;
    const hour = seconds / DateTimeTool.hoursOfOneDay;
    return [hour, minute, second].map((value) => addZero(value)).join(':');
  }
}

export default DateTimeTool;
