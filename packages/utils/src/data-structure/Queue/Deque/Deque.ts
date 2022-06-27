import DoublyLinkedList from '.././../List/DoublyLinkedList';

class Deque<T> {
  private deque = new DoublyLinkedList<T>();

  /**
   * 从队头入队
   */
  pushFront(value: T) {
    this.deque.unshift(value);
  }

  /**
   * 从队尾入队
   */
  pushBack(value: T) {
    this.deque.push(value);
  }

  /**
   * 队头
   */
  getFront() {
    return this.deque.getFirst();
  }

  /**
   * 队尾
   */
  getBack() {
    return this.deque.getLast();
  }

  /**
   * 从队头出队
   */
  popFront() {
    return this.deque.shift();
  }

  /**
   * 从队尾出队
   */
  popBack() {
    return this.deque.pop();
  }

  /**
   * 是否为空
   */
  isEmpty() {
    return this.deque.isEmpty();
  }

  /**
   * 获取长度
   */
  getSize() {
    return this.deque.size();
  }

  /**
   * 转换成数组
   */
  toArray() {
    return this.deque.toArray();
  }

  /**
   * 清空双端队列
   */
  clear() {
    this.deque.clear();
  }
}

export default Deque;
