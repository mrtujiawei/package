import DateTimeTool from './DateTimeTool';
import { objectToString } from './utils';

/**
 * 日志等级
 */
export enum LOG_LEVEL {
  ALL,
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
  OFF,
}

type Listener = (message: string) => void;

class Logger {
  static LOG_LEVEL = LOG_LEVEL;

  /**
   * 大于等于当前等级的才会打印
   * 默认不打印日志
   */
  private level: LOG_LEVEL = LOG_LEVEL.OFF;

  /**
   * 订阅函数
   */
  private listenHandle: Listener[] = [];

  /**
   * logger 实例
   */
  private static instance: Logger = new Logger();

  /**
   * 私有化构造函数
   * 不允许外部初始化
   */
  private constructor() {}

  /**
   * 格式化日志信息
   */
  private formatMessage(level: LOG_LEVEL, message: string): string[] {
    let logLevel: string = LOG_LEVEL[level];
    let time: string = DateTimeTool.dateTimeFormat(new Date());

    const result: string[] = [];
    (message || '').split('\n').forEach((line) => {
      result.push(`[${logLevel}] ${time} ${line}`);
    });

    return result;
  }

  /**
   * 处理参数
   * 1. 如果是字符串，直接返回
   * 2. 如果是undefined 或者 null，改成字符串
   * 3. 如果是Error,打印message 和 stack
   * 4. 如果是Date类型，打印时间戳
   * 5. 如果是对象，JSON.stringify
   */
  private getParameters(args: any[]): string {
    return args.map((item) => objectToString(item)).join(' ');
  }

  /**
   * 内部调用的输出函数
   */
  private print(level: LOG_LEVEL, messages: any[]) {
    if (level >= this.level) {
      this.publish(this.formatMessage(level, this.getParameters(messages)));
    }
  }

  /**
   * 内部发布消息，给订阅的函数
   */
  private publish(messages: string[]): void {
    messages.forEach((message) => {
      this.listenHandle.forEach((handle) => {
        try {
          handle(message);
        } catch (e) {
          Logger.instance.error(e);
        }
      });
    });
  }

  /**
   * 单例工厂,获取logger实例
   */
  static getLogger(): Logger {
    return this.instance;
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
    this.listenHandle.push(listener);
  }

  /**
   * 取消订阅
   */
  unsubscribe(listener: Listener): void {
    const index = this.listenHandle.indexOf(listener);
    if (-1 == index) {
      console.warn('Listener is not exists');
    } else {
      this.listenHandle.splice(index, 1);
    }
  }

  trace(...messages: any[]): void {
    this.print(LOG_LEVEL.TRACE, messages);
  }

  info(...messages: any[]): void {
    this.print(LOG_LEVEL.INFO, messages);
  }

  debug(...messages: any[]): void {
    this.print(LOG_LEVEL.DEBUG, messages);
  }

  warn(...messages: any[]): void {
    this.print(LOG_LEVEL.WARN, messages);
  }

  error(...messages: any[]): void {
    this.print(LOG_LEVEL.ERROR, messages);
  }

  fatal(...messages: any[]): void {
    this.print(LOG_LEVEL.FATAL, messages);
  }
}

export default Logger;
