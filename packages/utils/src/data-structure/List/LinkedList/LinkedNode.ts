/**
 * 单向链表节点
 * @filename packages/utils/src/data-structure/List/LinkedList/LinkedNode.ts
 * @author Mr Prince
 * @date 2022-06-24 21:08:25
 */
class LinkedNode<T> {
  /**
   * 节点值
   */
  private value: T;

  /**
   * 下一个节点
   */
  private next: LinkedNode<T> | null;

  /**
   * @param value 节点值
   * @param next 下一个节点,使用的时候更方便
   */
  constructor(value: T, next?: LinkedNode<T> | null) {
    this.value = value;
    this.next = undefined === next ? null : next;
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

  setNext(next: LinkedNode<T> | null) {
    this.next = next;
  }
}

export default LinkedNode;
