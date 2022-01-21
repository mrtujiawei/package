/**
 * 单向链表
 * @filename: packages/utils/src/data-structure/List/LinkedList/LinkedList.ts
 * @author: Mr Prince
 * @date: 2022-06-24 21:07:43
 */
import LinkedNode from './LinkedNode';

class LinkedListEmptyError extends Error {
  constructor(message = 'LinkedList is empty') {
    super(message);
  }
}

class InvalidIndexError extends Error {
  constructor(message = 'Index is invalid') {
    super(message);
  }
}

/**
 * @public
 */
class LinkedList<T> {
  /**
   * 没有节点时移除节点错误
   */
  static readonly LinkedListEmptyError = LinkedListEmptyError;

  /**
   * 下标错误
   */
  static readonly InvalidIndexError = InvalidIndexError;

  /**
   * 头结点，占位
   * 减少一些判断
   */
  private head = this.createEmptyNode();

  /**
   * 节点个数
   */
  private size = 0;

  constructor(list?: LinkedList<T>) {
    if (undefined != list) {
      this.head = this.deepClone(list);
      this.size = list.size;
    }
  }

  /**
   * 长度
   */
  getSize() {
    return this.size;
  }

  /**
   * 是否为空
   */
  isEmpty() {
    return 0 == this.size;
  }

  /**
   * 是否非空
   */
  isNotEmpty() {
    return !this.isEmpty();
  }

  /**
   * 清空链表
   */
  clear() {
    this.head.setNext(null);
    this.size = 0;
  }

  /**
   * 头插
   */
  insertFirst(value: T) {
    this.head.setNext(new LinkedNode(value, this.head.getNext()));
    this.size++;
    return this.size;
  }

  /**
   * 在指定下标插入
   */
  insertAt(index: number, value: T) {
    this.checkIndexIsValid(index);
    let p = this.head;
    for (let i = 0; i < index; i++) {
      p = p.getNext()!;
    }
    p.setNext(new LinkedNode(value, p.getNext()));
    this.size++;
    return this.size;
  }

  /**
   * 尾插
   */
  insertLast(value: T) {
    this.size++;
    let p = this.head;
    while (p.hasNext()) {
      p = p.getNext()!;
    }
    p.setNext(new LinkedNode<T>(value));
    return this.size;
  }

  /**
   * 移除头结点
   */
  removeFirst() {
    this.checkListIsEmpty();
    const node = this.head.getNext()!;
    this.head.setNext(node.getNext());
    this.size--;
    return node.getValue();
  }

  /**
   * 移除最后一个节点
   */
  removeLast() {
    this.checkListIsEmpty();
    let p = this.head;
    while (p.getNext()!.hasNext()) {
      p = p.getNext() as LinkedNode<T>;
    }
    const last = p.getNext()!;
    p.setNext(null);
    this.size--;
    return last.getValue();
  }

  /**
   * 移除指定下标的节点
   */
  removeAt(index: number) {
    this.checkIndexIsValid(index);
    // 主要是 index 必须小于 size
    this.checkIndexIsValid(index + 1);
    let p = this.head;
    for (let i = 0; i < index; i++) {
      p = p.getNext()!;
    }
    const node = p.getNext()!;
    p.setNext(node.getNext());
    return node.getValue();
  }

  /**
   * 移除满足条件的节点
   */
  removeEach(
    callback: (value: T, index: number, context: LinkedList<T>) => boolean
  ) {
    const originSize = this.size;
    let prev = this.head;

    for (let i = 0; prev.hasNext(); i++) {
      if (callback(prev.getNext()!.getValue(), i, this)) {
        prev.setNext(prev.getNext()!.getNext());
        this.size--;
      } else {
        prev = prev.getNext()!;
      }
    }

    return originSize - this.size;
  }

  /**
   * 检查链表是否为空
   */
  private checkListIsEmpty() {
    if (this.isEmpty()) {
      throw new LinkedList.LinkedListEmptyError();
    }
  }

  /**
   * 检查下标是否合法
   */
  private checkIndexIsValid(index: number) {
    if (0 > index || index > this.size) {
      throw new LinkedList.InvalidIndexError();
    }
  }

  /**
   * 深克隆
   * 只克隆 LinkedList 中的节点
   */
  private deepClone(list: LinkedList<T>) {
    const head = this.createEmptyNode();
    let prev = head;
    list.forEach((value) => {
      prev.setNext(new LinkedNode(value));
      prev = prev.getNext()!;
    });

    return head;
  }

  /**
   * 克隆一个新的list
   */
  clone(list: LinkedList<T>) {
    const head = this.deepClone(list);
    const newList = new LinkedList<T>();
    newList.head = head;
    newList.size = list.size;
    return newList;
  }

  /**
   * 遍历链表
   */
  forEach(
    callback: (value: T, index: number, context: LinkedList<T>) => void
  ): void {
    let p = this.head.getNext();
    for (let i = 0; p; p = p.getNext(), i++) {
      callback(p.getValue(), i, this);
    }
  }

  /**
   * 遍历并过滤
   */
  filter(
    callback: (value: T, index: number, context: LinkedList<T>) => boolean
  ) {
    const list = new LinkedList<T>();
    let p = list.head;
    this.forEach((value, index, context) => {
      if (callback(value, index, context)) {
        list.size++;
        p.setNext(new LinkedNode(value));
        p = p.getNext() as LinkedNode<T>;
      }
    });
    return list;
  }

  /**
   * 查找指定值
   */
  find(callback: (value: T, index: number, context: LinkedList<T>) => boolean) {
    let index = 0;
    for (const currentValue of this) {
      if (callback(currentValue, index, this)) {
        return currentValue;
      }
      index++;
    }
  }

  /**
   * 获取首个元素
   */
  getFirst() {
    this.checkListIsEmpty();
    return this.head.getNext()!.getValue();
  }

  /**
   * 转数组
   */
  toArray() {
    const arr: T[] = [];
    this.forEach((value) => {
      arr.push(value);
    });
    return arr;
  }

  /**
   * 迭代器
   */
  [Symbol.iterator]() {
    let p = this.head;
    function next() {
      let value!: T;
      let done = true;
      if (p.hasNext()) {
        done = false;
        p = p.getNext()!;
        value = p.getValue();
      }
      return { value, done };
    }
    return {
      next,
    };
  }

  /**
   * 创建空间点,比如头结点
   */
  private createEmptyNode() {
    return new LinkedNode<T>(0 as unknown as T);
  }

  /**
   * 从数组创建链表
   */
  static fromArray<T>(values: T[]) {
    const list = new LinkedList<T>();
    for (let i = values.length - 1; i >= 0; i--) {
      list.insertFirst(values[i]);
    }
    return list;
  }
}

export default LinkedList;
