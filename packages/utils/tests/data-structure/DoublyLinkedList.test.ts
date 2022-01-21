/**
 * 链表测试
 * @filename: linkList.test.ts
 * @author: Mr Prince
 * @date: 2021-11-05 11:01:56
 */
import { DoublyLinkedList } from '../../src/index';

describe('DoublyLinkedList test', () => {
  test('LinkList length test', () => {
    const list = new DoublyLinkedList<number>();
    expect(list.isEmpty()).toBe(true);
    expect(list.size()).toBe(0);
  });

  test('LinkList push & clear test', () => {
    const list = new DoublyLinkedList<number>();
    const size = 5;
    for (let i = 0; i < size; i++) {
      list.push(i);
    }

    expect(list.isEmpty()).toBe(false);
    expect(list.size()).toBe(size);
    expect(list.contains(1)).toBe(true);
    expect(list.contains(size)).toBe(false);

    const result = list.toArray();
    for (let i = 0; i < size; i++) {
      expect(result[i]).toBe(i);
    }
    list.clear();

    expect(list.isEmpty()).toBe(true);
  });
});
