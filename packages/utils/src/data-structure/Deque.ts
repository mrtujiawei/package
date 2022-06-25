/**
 * 双端队列
 * @filename: /home/tujiawei/github/package/packages/utils/src/data-structure/Deque.ts
 * @author: Mr Prince
 * @date: 2022-06-24 16:02:22
 */
class Deque<T> {
  static readonly DequeEmptyError = class extends Error {
    constructor(message: string = 'Deque is empty') {
      super(message);
    }
  }

  private queue: T[] = [];

  /**
   * 检查队列是否为空
   */
  private checkIsEmpty() {
    if (this.isEmpty()) {
      throw new Deque.DequeEmptyError();
    }
  }

  /**
   * 队列长度
   */
  get size(): number {
    return this.queue.length;
  }

  /**
   * 队头
   */
  get front() {
    this.checkIsEmpty();
    return this.queue[0];
  }

  /**
   * 队尾
   */
  get tail() {
    this.checkIsEmpty();
    return this.queue[this.queue.length - 1];
  }

  /**
   * 是否为空
   */
  isEmpty(): boolean {
    return 0 == this.size;
  }

  /**
   * 入队
   */
  enqueue(...values: T[]): void {
    this.queue.push(...values);
  }

  /**
   * 出队
   */
  dequeue(): T {
    this.checkIsEmpty();
    return <T>this.queue.shift();
  }
}

export default Deque;
