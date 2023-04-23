/**
 * 任务队列封装, 同一时间只能处理一件事
 * @filename: TaskQueue.js
 * @author: Mr Prince
 * @date: 2020-09-02 17:12:29
 */
import Lock from './Lock';

interface Options {
  /**
   * 任务超时时间
   */
  timeout?: number,

  /**
   * 实际实行任务的函数
   */
  handler?: Function,
};

/**
 * @public
 */
class TaskQueue {
  access: Lock = new Lock(1);
  timeout: number = 60000;
  handler: Function = function () {};

  constructor(options: Options) {
    this.setOptions(options);
  }

  /**
   * 修改全局延时和回调函数
   */
  setOptions(options: Options): void {
    if (options.timeout) {
      this.timeout = options.timeout;
    }
    if (options.handler) {
      this.handler = options.handler;
    }
  }

  /**
   * 执行回调
   * 需传入handler对应参数
   */
  async push(...args: any[]): Promise<any> {
    try {
      await this.getAccess();
      return await this.handler(...args);
    } finally {
      this.access.unlock();
    }
  }

  /**
   * 获取执行权限
   * 超过一定时间后自动结束
   */
  private getAccess(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.timeout && setTimeout(() => {
        reject('timeout');
      }, this.timeout);
      await this.access.lock();
      resolve();
    });
  }
}

export default TaskQueue;
