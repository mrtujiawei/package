/**
 * 小顶堆
 * compare返回值取个相反数就是大顶堆
 * @filename: Heap.ts
 * @author: Mr Prince
 * @date: 2021-07-13 09:02:21
 */

/**
 * @public
 */
class Heap<T> {
  private heap: T[];
  private compare: (a: T, b: T) => number;

  static readonly CompareInvalidError = class extends Error {
    constructor(message: string = 'Param Compare is not a function.') {
      super(message);
    }
  }

  static readonly HeapEmptyError = class extends Error {
    constructor(message: string = 'Heap is empty') {
      super(message);
    }
  }


  /**
   * @param compare - 比较函数
   * @param arr - 初始数据,需要注意不要再继续使用这个数组了
   */
  constructor(compare: (a: T, b: T) => number, arr: T[] = []) {
    if (!(compare instanceof Function)) {
      throw new Heap.CompareInvalidError();
    }
    this.compare = compare;
    this.heap = arr;
    this.buildHeap();
  }

  /**
   * 根据初始数据建堆
   */
  private buildHeap(): void {
    let heapSize = this.heap.length;
    for (let  i = (heapSize >> 1) - 1; i >= 0; i--) {
      this.shiftDown(i);
    }
  }

  /**
   * 下沉操作调整堆
   * 类似数组移位,把要移动的数据移出来，找到第一个不满足要求的数据的位置，填入
   */
  private shiftDown(index: number): void {
    let arr: T[] = this.heap;
    let heapSize: number = arr.length;
    let value: T = arr[index];

    let half: number = heapSize >> 1;
    while (index < half) {
      let childIndex: number = (index << 1) + 1;
      let child: T = arr[childIndex];
      let rightIndex: number = childIndex + 1;

      // 右子节点存在且比左子节点小
      if (rightIndex < heapSize && 0 < this.compare(child, arr[rightIndex])) {
        child = arr[rightIndex];
        childIndex = rightIndex;
      }

      // 当前节点已经小于等于所有子节点
      if (0 >= this.compare(value, child)) {
        break;
      }

      arr[index] = child;
      index = childIndex;
    }
    arr[index] = value;
  }

  /**
   * 上浮操作调整堆
   */
  private shiftUp(index: number):void {
    let arr: T[] = this.heap;
    let value = arr[index];
    let parentIndex: number = (index - 1) >> 1;
    // 父节点存在且大于当前节点值
    while (0 <= parentIndex && 0 < this.compare(arr[parentIndex], value)) {
      arr[index] = arr[parentIndex];
      index = parentIndex;
      parentIndex = (index - 1) >> 1;
    }
    arr[index] = value;
  }

  /**
   * 获取堆大小
   */
  get size(): number {
    return this.heap.length;
  }

  /**
   * 是否为空
   */
  isEmpty(): boolean {
    return 0 == this.size;
  }

  /**
   * 是否非空
   * @description 使用过程中经常会用到非空判断，就给它加上了
   */
  isNotEmpty(): boolean {
    return !this.isEmpty();
  }

  /**
   * 获取顶点值
   */
  peak(): T {
    if (this.isEmpty()) {
      throw new Heap.HeapEmptyError();
    }
    return this.heap[0];
  }

  /**
   * 插入节点
   */
  insert(value: T): void {
    this.heap.push(value);
    this.shiftUp(this.size - 1);
  }

  /**
   * 移除顶点
   */
  remove(): T {
    if (this.isEmpty()) {
      throw new Heap.HeapEmptyError();
    }
    let value: T = this.heap[0];
    let tail = <T>this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = tail;
      this.shiftDown(0);
    }
    return value;
  }

  /**
   * 替换顶点
   * @description 限制堆大小的情况下，经常会有一下两种情况
   * 1. 先remove后insert
   * 2. 先insert后remove的操作
   * 其实完全可以通过一步操作来实现
   * 所以添加了这样一个 replaceTop 方法
   */
  replaceTop(value: T): void {
    if (this.isEmpty()) {
      this.insert(value);
    } else {
      this.heap[0] = value;
      this.shiftDown(0);
    }
  }

  /**
   * 清空堆
   */
  clear(): void {
    this.heap = [];
  }

  /**
   * 获取当前heap内容
   */
  toArray() {
    return this.heap.slice();
  }
}

export default Heap;
