/**
 * 队列
 * @filename: Queue.js
 * @author: Mr Prince
 * @date: 2021-05-07 15:30:21
 */
import DoublyLinkedList from "../../List/DoublyLinkedList";

class Queue<T> {
  /**
   * 队列为空时仍获取元素
   */
  static readonly QueueEmptyError = class extends Error {
    constructor(message: string = 'Queue is empty') {
      super(message);
    }
  };

  private queue = new DoublyLinkedList<T>();

  /**
   * 检查队列是否为空
   */
  private checkIsEmpty() {
    if (this.isEmpty()) {
      throw new Queue.QueueEmptyError();
    }
  }

  /**
   * 队列长度
   */
  get size(): number {
    return this.queue.size();
  }

  /**
   * 队头
   */
  get front() {
    this.checkIsEmpty();
    return this.queue.getFirst();
  }

  /**
   * 队尾
   */
  get tail() {
    this.checkIsEmpty();
    return this.queue.getLast();
  }

  /**
   * 是否为空
   */
  isEmpty(): boolean {
    return this.queue.isEmpty();
  }

  /**
   * 是否非空
   */
  isNotEmpty() {
    return !this.isEmpty();
  }

  /**
   * 入队
   */
  enqueue(...values: T[]): void {
    values.forEach(value => {
      this.queue.push(value);
    });
  }

  /**
   * 出队
   */
  dequeue(): T {
    this.checkIsEmpty();
    return <T>this.queue.shift();
  }
}

export default Queue;
