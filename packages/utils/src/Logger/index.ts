import DateTimeTool from '../utils/DateTimeTool';
import { addZero } from '../utils/StringUtils';
import type { Primitive } from '../types';
// 这个库 jest 使用过程中会报错
// import chalk from 'chalk';

/**
 * 允许接收的内容类型
 * symbol 隐式转字符串会报错
 */
type ContentType = Exclude<Primitive, symbol>;

/**
 * 日志等级
 */
enum LOG_LEVEL {
  ALL,
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
  OFF,
}

/**
 * 消息相关内容
 */
class Content {
  /**
   * 记录时间
   */
  readonly logDate: Date;

  /**
   * 日志内容
   */
  readonly content: ContentType;

  /**
   * 日志等级
   */
  readonly logLevel: LOG_LEVEL;

  /**
   * logger 标识
   */
  readonly identifier: string;

  constructor(content: ContentType, logLevel: LOG_LEVEL, identifier: string) {
    this.logDate = new Date();
    this.content = content;
    this.logLevel = logLevel;
    this.identifier = identifier;
  }

  /**
   * 获取经过格式化的日志日期
   */
  getFormattedLogDate() {
    return DateTimeTool.dateFormat(this.logDate);
  }

  /**
   * 获取经过格式化的日志时间
   */
  getFormattedLogTime() {
    const ms = addZero(this.logDate.getTime() % 1000, 3);
    return DateTimeTool.timeFormat(this.logDate) + `.${ms}`;
  }

  /**
   * 获取经过格式化的日志日期和时间
   */
  getFormattedLogDateTime() {
    return this.getFormattedLogDate() + ' ' + this.getFormattedLogTime();
  }

  /**
   * 获取格式化后的消息
   */
  getFormattedMessage() {
    const time = this.getFormattedLogTime();
    const level = LOG_LEVEL[this.logLevel];

    const content = `${time} [${level}] ${this.identifier} - ${this.content}`;
    // const content = `${chalk.blue(`${time} [${level}] ${this.identifier} -`)} ${
    //   this.content
    // }`;

    return content;
  }
}

type Listener = (content: Content) => void;

class Logger {
  static LOG_LEVEL = LOG_LEVEL;

  static Content = Content;

  /**
   * logger 实例
   */
  private static instances: Map<string, Logger> = new Map();

  /**
   * 是否有效
   * 如果移除之后，改为无效
   */
  private valid = true;

  /**
   * 实例标识
   */
  private identifier: string;

  /**
   * 大于等于当前等级的才会打印
   * 默认不打印日志
   */
  private level: LOG_LEVEL = LOG_LEVEL.OFF;

  /**
   * 订阅函数
   */
  private listeners = new Set<Listener>();

  /**
   * 私有化构造函数
   * 不允许外部初始化
   */
  private constructor(identifier: string) {
    this.identifier = identifier;
  }

  /**
   * 单例工厂,获取logger实例
   */
  static getLogger(identifier: string = 'default'): Logger {
    if (!this.instances.has(identifier)) {
      this.instances.set(identifier, new Logger(identifier));
    }
    return this.instances.get(identifier) as Logger;
  }

  /**
   * 移除实例
   * @description 获取之后保存在外部的实例无法更改
   * @returns 是否移除成功
   */
  static removeLogger(logger: Logger): boolean {
    if (!this.instances.has(logger.identifier)) {
      return false;
    }
    const instance = this.instances.get(logger.identifier) as Logger;
    instance.setLevel(LOG_LEVEL.OFF);
    instance.unsubscribeAll();
    instance.valid = false;
    this.instances.delete(logger.identifier);
    return true;
  }

  static removeLoggerAll() {
    this.instances.forEach((logger) => {
      this.removeLogger(logger);
    });
  }

  private print(level: LOG_LEVEL, content: ContentType) {
    if (this.valid && level >= this.level) {
      this.publish(new Content(content, level, this.identifier));
    }
  }

  /**
   * 内部发布消息，给订阅的函数
   */
  private publish(content: Content): void {
    this.listeners.forEach((listener) => {
      listener(content);
    });
  }

  /**
   * 获取当前日志等级
   */
  getLevel() {
    return this.level;
  }

  /**
   * 设置日志等级
   */
  setLevel(level: LOG_LEVEL): void {
    this.level = level;
  }

  /**
   * 添加订阅
   */
  subscribe(listener: Listener): void {
    this.listeners.add(listener);
  }

  /**
   * 取消订阅
   * @param listener - 要取消订阅的回调
   * @returns - 是否清除成功
   */
  unsubscribe(listener: Listener): boolean {
    if (this.listeners.has(listener)) {
      this.listeners.delete(listener);
      return true;
    }
    return false;
  }

  /**
   * 清除全部订阅
   */
  unsubscribeAll(): void {
    this.listeners.clear();
  }

  /**
   * 默认的监听函数
   */
  private defaultListener(content: Content) {
    console.log(content.getFormattedMessage());
  }

  /**
   * 设置默认配置
   *
   * 1. 使用`console.log`输出所有等级的日志
   * 2. 使用默认格式化方式
   *
   * 调用后会将原有的日志等级调整为ALL
   */
  setDefaultConfig() {
    if (!this.listeners.has(this.defaultListener)) {
      this.setLevel(LOG_LEVEL.ALL);
      this.subscribe(this.defaultListener);
    }
  }

  /**
   * 移除默认的监听器
   *
   * 调用后会将原有的日志等级调整为OFF
   */
  removeDefaultConfig() {
    if (this.listeners.has(this.defaultListener)) {
      this.setLevel(LOG_LEVEL.OFF);
      this.unsubscribe(this.defaultListener);
    }
  }

  trace(content: ContentType): void {
    this.print(LOG_LEVEL.TRACE, content);
  }

  debug(content: ContentType): void {
    this.print(LOG_LEVEL.DEBUG, content);
  }

  info(content: ContentType): void {
    this.print(LOG_LEVEL.INFO, content);
  }

  warn(content: ContentType): void {
    this.print(LOG_LEVEL.WARN, content);
  }

  error(content: ContentType): void {
    this.print(LOG_LEVEL.ERROR, content);
  }

  fatal(content: ContentType): void {
    this.print(LOG_LEVEL.FATAL, content);
  }

  isTraceEnabled(): boolean {
    return LOG_LEVEL.TRACE >= this.level;
  }

  isDebugEnabled(): boolean {
    return LOG_LEVEL.DEBUG >= this.level;
  }

  isInfoEnabled(): boolean {
    return LOG_LEVEL.INFO >= this.level;
  }

  isWarnEnabled(): boolean {
    return LOG_LEVEL.WARN >= this.level;
  }

  isErrorEnabled(): boolean {
    return LOG_LEVEL.ERROR >= this.level;
  }

  isFatalEnabled(): boolean {
    return LOG_LEVEL.FATAL >= this.level;
  }
}

export default Logger;
