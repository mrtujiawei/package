/**
 * 锁
 * @filename: Lock.js
 * @author: Mr Prince
 * @date: 2020-09-02 20:06:39
 */
import Queue from './Queue';

class Lock {

  /**
   * size大小不合理
   */
  static readonly InvalidSizeError = class extends Error {
    constructor(message: string = 'Size is invalid') {
      super(message);
    }
  };

  /**
   * 放等待锁的回调函数
   */
  private queue: Queue<Function> = new Queue<Function>();

  /**
   * 当前被占用的个数
   * 每 lock 一次，size++
   * 每 unlock 一次, size--
   * 超过 maxSize 时，进入队列
   * 当 unlock 时会检查队列是否为空
   * 如果不为空则将队首任务出列、执行
   */
  private size: number = 0;

  /**
   * 最大可以占用的个数
   */
  private maxSize: number = 1;

  constructor(size: number = 1) {
    this.setSize(size);
  }

  /**
   * 设置能够同时获取多少次权限
   */
  private setSize(size: number): void {
    if(size <= 0) {
      throw new Lock.InvalidSizeError();
    }
    this.maxSize = size;
  }

  /**
   * 获取锁
   */
  async lock(): Promise<void> {
    this.size++;
    if(this.size <= this.maxSize) {
      return ;
    }
    return new Promise(resolve => {
      this.queue.enqueue(resolve);
    });
  }

  /**
   * 尝试获取锁,需要注意获取到之后要释放
   */
  tryLock(): boolean {
    if (this.size < this.maxSize) {
      this.size++;
      return true;
    }
    return false;
  }

  /**
   * 释放锁
   */
  unlock(): void {
    if(this.size <= 0) {
      throw new Lock.InvalidSizeError();
    }

    // 因为每次加锁都会+1
    // 所以释放锁的时候要让他减1
    this.size--;

    // 如果有任务在等待，启动执行的任务
    if (!this.queue.isEmpty()) {
      this.queue.dequeue()();
    }
  }

  /**
   * 释放锁
   * @deprecated - Lock.unLock is deprecated, use Lock.unlock instead
   */
  unLock(): void {
    this.unlock();
  }
}

export default Lock;
