/**
 * 双向链表
 *
 * 除了 head 和 tail 只需要处理一个指针
 * 其他所有节点都需要处理两个
 */
class LinkListNode<T> {
  value: T;
  prev: LinkListNode<T>;
  next: LinkListNode<T>;

  constructor(value?: T, prev?: LinkListNode<T>, next?: LinkListNode<T>) {
    this.value = <T>value;
    this.prev = <LinkListNode<T>>prev;
    this.next = <LinkListNode<T>>next;
  }
}

const funcType = typeof function () {};
const isFunc = (value: any): boolean => funcType == typeof value;
const identity = (value: any) => value;
const isDef = (value: any): boolean => typeof value !== typeof void 0;

/**
 * 下标错误
 */
class InvalidIndexError extends Error {
  constructor(message: string = 'Index is invalid') {
    super(message);
  }
}

class LinkList<T> {
  static readonly InvalidIndexError = InvalidIndexError;
  private head: LinkListNode<T> = new LinkListNode<T>();
  private tail: LinkListNode<T> = new LinkListNode<T>();
  private length: number = 0;

  constructor() {
    this.clear();
  }

  /**
   * 检查下标，如果不对就报个错
   *
   * @param index - 下标
   */
  private checkIndex(index: number): void {
    if (index < 0 || index >= this.length) {
      throw new LinkList.InvalidIndexError();
    }
  }

  /**
   * 清空
   */
  clear(): void {
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.length = 0;
  }

  /**
   * 连接两个链表,不是纯函数
   */
  concat(linkList: LinkList<T>): LinkList<T> {
    if (linkList) {
      let firstNode = linkList.head.next;
      this.tail.prev.next = firstNode;
      firstNode.prev = this.tail.prev;
      this.tail = linkList.tail;
      this.length += linkList.size();
    }
    return this;
  }

  /**
   * 是否包含某个值
   */
  contains(value: T): boolean {
    return -1 != this.indexOf(value);
  }

  /**
   * 过滤出所有的值
   */
  filter(fn: (value: T, index: number, linkList: LinkList<T>) => boolean): LinkList<T> {
    let linkList = new LinkList<T>();
    this.forEach((value: T, index: number, linkList: LinkList<T>) => {
      fn(value, index, linkList) && linkList.push(<T>value);
    });
    return linkList;
  }

  /**
   * 查找第一个满足要求的元素, 找不到就是undefined
   */
  find(fn: (value: T, index: number, linkList: LinkList<T>) => boolean): T | undefined {
    for (let i = 0, node = this.head.next; node != this.tail; node = node.next, i++) {
      if (fn(node.value, i, this)) {
        return node.value;
      }
    }
  }

  /**
   * 查找第一个满足要求的元素下标
   */
  findIndex(fn: (value: T, index: number, linkList: LinkList<T>) => boolean): number {
    for (let i = 0, node = this.head.next; node != this.tail; node = node.next, i++) {
      if (fn(node.value, i++, this)) {
        return i;
      }
    }
    return -1;
  }

  /**
   * 简单循环
   */
  forEach(fn: (value: T, index: number, linkList: LinkList<T>) => void): void {
    for (let i = 0, node = this.head.next; node != this.tail; node = node.next, i++) {
      fn(node.value, i, this);
    }
  }

  /**
   * 获取指定下标的值
   */
  get(index: number): T {
    this.checkIndex(index);
    let node = this.head.next;
    for (let i = 0; i < index; node = node.next, i++);
    return node.value;
  }

  /**
   * 判断是否包含某一个值
   */
  includes(value: T): boolean {
    return -1 != this.indexOf(value);
  }

  /**
   * 查找指定值的下标
   */
  indexOf(value: T): number {
    return this.findIndex(val => val == value);
  }

  /**
   * 判断是否为空
   */
  isEmpty(): boolean {
    return 0 == this.length;
  }

  /**
   * 根据指定分隔符连接字符串
   */
  join(delimiter: string = '', transfer: (value: T, index: number, linkList: LinkList<T>) => string = identity): string {
    if (!isFunc(transfer)) {
      throw new TypeError('transfer is not a function');
    }
    let result: string[] = [];
    this.forEach((value, index) => {
      result.push(transfer(value, index, this));
    });
    return result.join(delimiter);
  }

  /**
   * 指定值的最大下标
   */
  lastIndexOf(value: T): number {
    for (let node = this.tail.prev, i = this.length - 1; node != this.head; node = node.prev, i--) {
      if (value == node.value) {
        return i;
      }
    }
    return -1;
  }

  /**
   * 指定条件的映射
   * 返回一个新
   */
  map(fn: (value: T, index: number, linkList: LinkList<T>) => T): LinkList<T> {
    let linkList = new LinkList<T>();
    this.forEach((value: T, index: number) => {
      linkList.push(
        fn(value, index, this)
      );
    });
    return linkList;
  }

  /**
   * 去掉最后一个
   */
  pop(): T | undefined {
    if (0 == this.length) {
      return;
    }
    this.length--;
    let tail = this.tail.prev;
    tail.prev.next = this.tail;
    this.tail.prev = tail.prev;
    return tail.value;
  }

  /**
   * 向尾部添加
   */
  push(value: T): number {
    let node = new LinkListNode<T>(value);
    node.next = this.tail;
    node.prev = this.tail.prev;
    this.tail.prev.next = node;
    this.tail.prev = node;
    this.length++;
    return this.length;
  }

  /**
   * 缩减
   */
  reduce(fn: (prev: any, currentValue: T, index: number) => any, initialValue?: any): any {
    if (!this.size() && !isDef(initialValue)) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    this.forEach((value, index) => {
      if (index == 0) {
        if(isDef(initialValue)){
          initialValue = fn(initialValue, <T>value, index);
        } else {
          initialValue = value;
        }
        return;
      }
      initialValue = fn(initialValue, <T>value, <number>index);
    });
    return initialValue;
  }

  /**
   * 反向缩减
   */
  reduceRight(fn: (prev: any, currentValue: T, index: number) => any, initialValue?: any): any {
    let i = this.size() - 1;
    let node = this.tail.prev;
    if(!isDef(initialValue)) {
      if(!this.size()) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      initialValue = node.value;
      node = node.prev;
      i--;
    }
    for (; node != this.head; node = node.prev, i--) {
      initialValue = fn(initialValue, node.value, i);
    }
    return initialValue;
  }

  /**
   * 移除指定下标的值
   */
  remove(index: number): T | undefined {
    this.checkIndex(index);
    for (let i = 0, node = this.head.next; node != this.tail; node = node.next, i++) {
      if (i == index) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        this.length--;
        return node.value;
      }
    }
  }

  /**
   * 反转， 应该要改变原来的
   * 这里不是简单改个头指针就行了
   * 需要交换每个节点的前后指针
   */
  reverse(): LinkList<T> {
    let startNode = this.head.next;
    let endNode = this.tail;
    this.clear();
    while(startNode != endNode) {
      this.unshift(startNode.value);
      startNode = startNode.next;
    }
    return this;
  }

  /**
   * 设置指定位置的值
   */
  set(index: number, value: T): void {
    this.checkIndex(index);
    for (let i = 0, node = this.head.next; node != this.tail; node = node.next, i++) {
      if (i == index) {
        node.value = value;
        break;
      }
    }
  }

  /**
   * 移除第一个
   */
  shift(): T | undefined {
    if (this.size()) {
      let node = this.head.next;
      this.head.next = node.next;
      node.next.prev = this.head;
      this.length--;
      return node.value;
    }
  }

  /**
   * 获取的长度
   */
  size(): number {
    return this.length;
  }

  /**
   * 获取其中的一段
   */
  slice(start: number = 0, end?: number): LinkList<T> {
    start = start || 0;
    end = isDef(end) ? end : this.size();
    end = <number>end > -1 ? end : (this.size() - <number>end);
    let linkList = new LinkList<T>();
    this.forEach((value, index) => {
      if (index >= start && index < <number>end) {
        linkList.push(value);
      }
    });
    return linkList;
  }

    /**
     * 遍历其中的一部分, 和findIndex逻辑几乎一样
     */
  some(fn: (value: T, index: number) => boolean): boolean {
    return this.findIndex(fn) != -1;
  }

  /**
   * 排序,选择排序，毕竟是自己写的工具，要求不能太高
   */
  sort(fn: (item1: T, item2: T) => number) {
    for (let startNode = this.head.next; startNode != this.tail; startNode = startNode.next) {
      let changeNode = startNode;
      for (let currentNode = startNode.next; currentNode != this.tail; currentNode = currentNode.next) {
        if (fn(changeNode.value, currentNode.value) > 0) {
          changeNode = currentNode;
        }
      }
      [startNode.value, changeNode.value] = [changeNode.value, startNode.value];
    }
    return this;
  }

  toString(): string {
    return this.join();
  };

  toArray(): T[] {
    return this.reduce((result, value) => {
      result.push(value);
      return result;
    }, []);
  }

  /**
   * 向头部添加
   */
  unshift(value: T): void {
    let node = new LinkListNode<T>(value);
    node.next = this.head.next;
    node.prev = this.head;

    /**
     * fix
     * unshift的时候会漏掉一个数据
     */
    this.head.next.prev = node;

    this.head.next = node;
    this.length++;
  }

  /**
   * 返回一个迭代器
   * 为了能够for..of循环
   */
  [Symbol.iterator]() {
    let node = this.head.next;
    let end = this.tail;
    return {
      next() {
        let done = node == end;
        let value!: T;
        if(!done) {
          value = node.value;
          node = node.next;
        }
        return {
          value,
          done
        };
      }
    }
  }
}

export default LinkList;
