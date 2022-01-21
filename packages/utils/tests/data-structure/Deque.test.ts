import { Deque } from '../../src';

describe('Deque test', () => {
  test('Size test', () => {
    const queue = new Deque<number>();
    expect(queue.isEmpty()).toBeTruthy();
    expect(queue.isNotEmpty()).toBeFalsy();
  });

  test('Enque front test', () => {
    const queue = new Deque<number>();
    queue.pushFront(0);
    queue.pushFront(1);
    queue.pushFront(2);
    queue.pushFront(3);
    queue.pushFront(4);
    expect(queue.getSize()).toBe(5);
    expect(queue.isEmpty()).toBeFalsy();
    expect(queue.isNotEmpty()).toBeTruthy();
  });

  test('Deque double end test', () => {
    const queue = new Deque<number>();
    queue.pushFront(0);
    queue.pushFront(1);
    queue.pushFront(2);
    queue.pushFront(3);
    queue.pushFront(4);
    expect(queue.popFront()).toBe(4);
    expect(queue.popBack()).toBe(0);
    expect(queue.popFront()).toBe(3);
    expect(queue.popBack()).toBe(1);
    expect(queue.popFront()).toBe(2);
    expect(() => {
      queue.popFront()
    }).toThrow(Deque.DequeEmptyError);
    expect(queue.isEmpty()).toBeTruthy();
    expect(queue.isNotEmpty()).toBeFalsy();
  });

  test('Clear test', () => {
    const queue = new Deque<number>();
    queue.pushBack(0);
    queue.pushBack(1);
    queue.pushBack(2);
    queue.pushBack(3);
    queue.pushBack(4);
    expect(queue.isEmpty()).toBeFalsy();
    expect(queue.isNotEmpty()).toBeTruthy();

    queue.clear();
    expect(queue.isEmpty()).toBeTruthy();
    expect(queue.isNotEmpty()).toBeFalsy();
  });
});
