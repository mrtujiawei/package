/**
 * 跳表
 * @filename: Skiplist.ts
 * @author: Mr Prince
 * @date: 2022-05-28 21:39:49
 */

class SkipListNode<T> {
  nexts: SkipListNode<T>[];

  constructor(public value: T, level: number) {
    this.nexts = new Array(level).fill(null);
  }
}

enum INSERT_MODE {
  UNIQUE,
  MULTIPLE,
}

/**
 * 跳表
 */
class SkipList<T> {
  /**
   * 插入模式
   * 如果不能重复插入，insert 可能返回false
   */
  static readonly INSERT_MODE = INSERT_MODE;

  /**
   * 提升的概率
   */
  private static readonly probability = 1 / 2;

  /**
   * 最高等级
   */
  private static readonly MAX_LEVEL = 1 << 5;

  /**
   * 当前最高等级
   * 优化的一种手段把，可以少一点点遍历
   */
  private currentLevel = 1;

  /**
   * 头结点 不存放数据
   */
  private head = new SkipListNode<T>(null as unknown as T, SkipList.MAX_LEVEL);

  /**
   * 节点数
   */
  private size = 0;

  constructor(private compare: (a: T, b: T) => number) {}

  get length() {
    return this.size;
  }

  /**
   * 判断是否有完全相同的元素
   */
  search(target: T): boolean {
    let node = this.head;
    for (let i = this.currentLevel - 1; i >= 0; i--) {
      while (
        null != node.nexts[i] &&
        0 < this.compare(target, node.nexts[i].value)
      ) {
        node = node.nexts[i];
      }
      if (
        null != node.nexts[i] &&
        0 == this.compare(target, node.nexts[i].value)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * 满足 compareFn(value) >= 0 的第一个元素
   */
  lowerBound(compareFn: (value: T) => number): T {
    let node = this.head;

    for (let i = this.currentLevel - 1; i >= 0; i--) {
      while (null != node.nexts[i] && compareFn(node.nexts[i].value) < 0) {
        node = node.nexts[i];
      }
    }

    return node.nexts[0] && node.nexts[0].value;
  }

  upperBound(compareFn: (value: T) => number): T {
    let node = this.head;

    for (let i = this.currentLevel - 1; i >= 0; i--) {
      while (null != node.nexts[i] && compareFn(node.nexts[i].value) <= 0) {
        node = node.nexts[i];
      }
    }

    return node.nexts[0] && node.nexts[0].value;
  }

  /**
   * 获取第一个元素
   */
  getFirst(): T {
    return this.head.nexts[0]?.value;
  }

  /**
   * 插入模式
   * 允许重复插入的情况下
   * 多次插入相等的值, 最后插入的节点会在最前面
   * @returns 是否成功插入
   */
  insert(value: T, insertMode = SkipList.INSERT_MODE.MULTIPLE): boolean {
    const unique = insertMode == SkipList.INSERT_MODE.UNIQUE;
    const level = this.randomLevel();
    const forwards: SkipListNode<T>[] = new Array(level).fill(this.head);

    let node = this.head;

    // 找所有的前驱节点
    for (let i = Math.max(this.currentLevel, level) - 1; i >= 0; i--) {
      while (
        null != node.nexts[i] &&
        0 < this.compare(value, node.nexts[i].value)
      ) {
        node = node.nexts[i];
      }
      if (
        unique &&
        null != node.nexts[i] &&
        0 == this.compare(node.nexts[i].value, value)
      ) {
        return false;
      }
      if (i < level) {
        forwards[i] = node;
      }
    }

    // 实际的节点插入操作和属性更新操作
    this.currentLevel = Math.max(level, this.currentLevel);
    this.size++;
    const newNode = new SkipListNode(value, level);

    // 实际插入节点
    for (let i = 0; i < level; i++) {
      newNode.nexts[i] = forwards[i].nexts[i];
      forwards[i].nexts[i] = newNode;
    }

    return true;
  }

  /**
   * 删除指定值
   */
  remove(value: T): boolean {
    let result = false;
    this.removeImpl(value, () => {
      result = true;
    });
    return result;
  }

  /**
   * 移除并返回移除的值
   */
  removeAndReturn(value: T): T | null {
    let result: T | null = null;

    this.removeImpl(value, (value) => {
      result = value;
    });

    return result;
  }

  forEach(callback: (value: T, index: number, context: SkipList<T>) => void) {
    let i = 0;
    for (const value of this) {
      callback(value, i++, this);
    }
  }

  toArray() {
    const result: T[] = [];
    this.forEach((value) => {
      result.push(value);
    });
    return result;
  }

  isEmpty() {
    return this.length == 0;
  }

  isNotEmpty() {
    return !this.isEmpty();
  }

  [Symbol.iterator]() {
    let node = this.head.nexts[0];
    const next = () => {
      let value!: T;
      let done = !node;
      if (node) {
        value = node.value;
        node = node.nexts[0];
      }
      return {
        value,
        done,
      };
    };
    return {
      next,
    };
  }

  /**
   * 移除过后,删除孤立节点层
   */
  private reduceLevel() {
    while (
      this.currentLevel > 1 &&
      null == this.head.nexts[this.currentLevel - 1]
    ) {
      this.currentLevel--;
    }
  }

  /**
   * 随机节点高度
   */
  private randomLevel() {
    let level = 1;
    while (Math.random() < SkipList.probability && level < SkipList.MAX_LEVEL) {
      level++;
    }
    return level;
  }

  /**
   * 删除操作的具体实现
   */
  private removeImpl(value: T, callback: (value: T) => void) {
    const forwards: SkipListNode<T>[] = new Array(this.currentLevel).fill(null);
    let node = this.head;

    // 找所有的前驱节点
    for (let i = this.currentLevel - 1; i >= 0; i--) {
      // node.nexts[i].value < value
      while (
        null != node.nexts[i] &&
        0 < this.compare(value, node.nexts[i].value)
      ) {
        node = node.nexts[i];
      }
      forwards[i] = node;
    }

    let result = false;

    // 判断是否找到
    if (
      null != node.nexts[0] &&
      0 == this.compare(node.nexts[0].value, value)
    ) {
      result = true;
      callback(node.nexts[0].value);

      // 更新链接
      for (let i = this.currentLevel - 1; i >= 0; i--) {
        if (
          null != forwards[i].nexts[i] &&
          0 == this.compare(forwards[i].nexts[i].value, value)
        ) {
          forwards[i].nexts[i] = forwards[i].nexts[i].nexts[i];
        }
      }
    }

    if (result) {
      this.reduceLevel();
      this.size--;
    }
  }
}

export default SkipList;
