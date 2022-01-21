import { Queue, } from '../../src/index';

describe('Queue test', () => {
  test('New queue should be empty', () => {
    let queue = new Queue();
    expect(queue.isEmpty()).toBe(true);
  });

  test('Queue should have 50 items', () => {
    let queue = new Queue();
    for (let i = 0; i < 100; i++) {
      queue.enqueue(i);
      if (0 == i % 2) {
        queue.dequeue();
      }
    }
    expect(queue.size).toBe(50);
  });

  test('Queue should have 50-99 numbers', () => {
    let queue = new Queue<number>();
    for (let i = 0; i < 100; i++) {
      queue.enqueue(i);
      if (0 == i % 2) {
        queue.dequeue();
      }
    }
    let oddFlag = false;
    while (!queue.isEmpty()) {
      expect(queue.dequeue() % 2 == 1).toBe(oddFlag);
      oddFlag = !oddFlag;
    }
  });

  test('Dequeue empty queue show throw error', () => {
    let queue = new Queue();
    expect(() => {
      queue.dequeue();
    }).toThrow(Queue.QueueEmptyError);
  });
});
