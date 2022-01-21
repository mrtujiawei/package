import { sleep } from './utils';

/**
 * 消息内容: 倒计时时间 或 结束内容
 */
type Message = string | number;

interface Content {
  /**
   * 消息内容
   */
  message: Message;

  /**
   * 是否完成
   */
  done: boolean;
}

/**
 * 启动配置
 */
interface StartConfig {
  /**
   * 开始值,默认60
   */
  start: number;

  /**
   * 结束值,默认(0)
   */
  end: number;

  /**
   * 间隔时间(s),默认1
   */
  timeout: number;
}

/**
 * 回调函数类型
 */
type Callback = (content: Content) => void;

const START_CONFIG: StartConfig = {
  start: 60,
  end: 0,
  timeout: 1,
};

/**
 * 倒计时类
 */
class CountDown {
  private message: string = '';
  private callbacks: Callback[] = [];

  /**
   * 定义结束消息是什么
   */
  constructor(message: string) {
    this.message = message;
  }

  /**
   * 开始倒计时,异步执行，await 有效
   *
   * @param config - 启动配置
   */
  async start(config: StartConfig = START_CONFIG): Promise<void> {
    for (let i = config.start; i > config.end; i--) {
      this.publish(i, false);
      await sleep(config.timeout);
    }
    this.publish(this.message, true);
  }

  /**
   * 发布每次变化
   *
   * @param message - 倒计时时间 或 构造函数传入的内容
   */
  private publish(message: string | number, done: boolean): void {
    this.callbacks.forEach((fn) => {
      fn({
        message,
        done,
      });
    });
  }

  /**
   * 添加订阅
   *
   * @param callback - 订阅函数
   * @returns - 返回添加的函数
   */
  subscribe(callback: Callback): Callback {
    this.callbacks.push(callback);
    return callback;
  }

  /**
   * 取消订阅
   *
   * @param callback - subscribe 的函数
   * @returns - 是否移除, false 说明回调函数不存在
   */
  unsubscribe(callback: Callback): boolean {
    let index = this.callbacks.findIndex((cb) => cb == callback);
    if (-1 != index) {
      this.callbacks.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 清空所有订阅函数
   */
  clear(): void {
    this.callbacks = [];
  }
}

export default CountDown;
