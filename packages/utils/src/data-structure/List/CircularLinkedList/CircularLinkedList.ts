/**
 * 单向循环链表
 * @filename packages/utils/src/data-structure/List/CircularLinkedList/CircularLinkedList.ts
 * @author Mr Prince
 * @date 2023-03-23 11:54:35
 */
import LinkedNode from './LinkedNode';

class CircularLinkedList<T> {
  /**
   * 头结点的前驱节点
   */
  private head: LinkedNode<T> | null = null;

  /**
   * 节点个数
   */
  private size = 0;

  /**
   * 向尾部添加
   */
  add(value: T) {
    if (this.head == null) {
      this.head = new LinkedNode(value);
      this.head.setNext(this.head);
    } else {
      const prev = this.head;
      const next = prev.getNext();
      prev.setNext(new LinkedNode(value, next));
      this.head = prev.getNext();
    }
    this.size++;
  }

  /**
   * 头部移除
   */
  remove() {
    if (this.head == null) {
      return;
    }
    const prev = this.head;
    const next = prev.getNext();
    if (prev == next) {
      this.head = null;
      return prev.getValue();
    }
    prev.setNext(next!.getNext());
    return next?.getValue();
  }

  /**
   * 获取当前节点个数
   */
  getSize() {
    return this.size;
  }

  /**
   * 判断是否为空
   */
  isEmpty() {
    return this.size == 0;
  }

  /**
   * 判断是否非空
   */
  isNotEmpty() {
    return !this.isEmpty();
  }
}

export default CircularLinkedList;
