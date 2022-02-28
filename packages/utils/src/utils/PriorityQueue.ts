/**
 * 优先队列,默认小的在前
 * @filename: PriorityQueue.ts
 * @author: Mr Prince
 * @date: 2021-07-13 16:57:28
 */
import Heap from './Heap';

class PriorityQueue<T> {
  private queue: Heap<T>;

  constructor(compare: (a: T, b: T) => number) {
    this.queue = new Heap<T>(compare);
  }

  enqueue(value: T): void {
    this.queue.insert(value);
  }

  dequeue(): T {
    return this.queue.remove();
  }

  peak(): T {
    return this.queue.peak();
  }

  isEmpty(): boolean {
    return this.queue.isEmpty();
  }
}

export default PriorityQueue;
