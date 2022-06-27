/**
 * 单向链表节点
 * @filename: /home/tujiawei/github/package/packages/utils/src/data-structure/List/LinkedList/LinkedListNode.ts
 * @author: Mr Prince
 * @date: 2022-06-24 21:08:25
 */
class LinkedListNode<T> {
  /**
   * 节点值
   */
  private value: T;

  /**
   * 下一个节点
   */
  private next: LinkedListNode<T>;

  constructor(value: T, next?: LinkedListNode<T>) {
    this.value = value;
    this.next = undefined === next ? null as unknown as LinkedListNode<T>: next;
  }

  getValue() {
    return this.value;
  }

  setValue(value: T) {
    this.value = value;
  }

  hasNext() {
    return null != this.next;
  }

  getNext() {
    return this.next;
  }

  setNext(next: LinkedListNode<T>) {
    this.next = next;
  }
}

export default LinkedListNode;
