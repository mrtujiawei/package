/**
 * 单向循环链表节点
 * @filename /home/tujiawei/github/package/packages/utils/src/data-structure/List/CircularLinkedList/LinkedNode.ts
 * @author Mr Prince
 * @date 2023-03-23 11:56:03
 */
class LinkedNode<T> {
  constructor(private value: T, private next: LinkedNode<T> | null = null) {}

  getValue() {
    return this.value;
  }

  setValue(value: T) {
    this.value = value;
  }

  getNext() {
    return this.next;
  }

  setNext(next: LinkedNode<T> | null) {
    this.next = next;
  }
}

export default LinkedNode;
