/**
 * 跳表
 * @filename: SkipList.ts
 * @author: Mr Prince
 * @date: 2021-06-16 21:18:13
 */
class SkipList<K, V> {
  private static readonly MAX_LEVEL: number = 32;
  /**
   * 概率
   */
  private static readonly RATE: number = 0.25;

  static KeyTypeError = class extends Error {
    constructor(message = 'Key is null') {
      super(message);
    }
  }

  /**
   * 节点数
   */
  private _size: number = 0;

  /**
   * 首节点有效层数
   */
  private level: number = 0;

  /**
   * 不存放任何k-v
   */
  private first: Node<K, V>;

  constructor() {
    // @ts-ignore
    this.first = new Node<K, V>(null, null, null);
    this.first.nexts = new Array(SkipList.MAX_LEVEL);
  }

  private keyCheck(key: K): void {
    if (null == key) {
      throw new SkipList.KeyTypeError();
    }
  }
  
  private randomLevel(): number {
    let level: number = 1;

    while (Math.random() < SkipList.RATE && level < SkipList.MAX_LEVEL) {
      level++;
    }

    return level;
  }

  size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return 0 == this._size;
  }

  /**
   * 添加的时候随机多少层
   * 先找到位置插入
   * 完成插入后随机添加层
   * 完成所有指向
   */
  put(key: K, value: V): V {
    this.keyCheck(key);
    let node: Node<K, V> = this.first;
    let prevNodes: Node<K, V>[] = new Array(this.level);
    for (let i = this.level - 1; i >= 0; i--) {
      let next: Node<K, V> = node.nexts[i];
      while (next && next.key < key) {
        node = next;
      }
      // key存在，直接覆盖
      if (next && next.key == key) {
        let oldValue: V = next.value;
        next.value = value;
        return oldValue;
      }
      prevNodes[i] = node;
    }

    let level = this.randomLevel();
    let newNode = new Node<K, V>(key, value, level);

    for (let i = 0; i < level; i++) {
      if (level < this.level) {
        newNode.nexts[i] = prevNodes[i].nexts[i];
        prevNodes[i].nexts[i] = newNode;
      } else {
        this.first.nexts[i] = newNode;
      }
    }

    node = this.first;
    this._size++;
    this.level = Math.max(level, this.level);

    return value;
  }

  get(key: K): V | null {
    let node: Node<K, V> = this.first;
    for (let i = this.level - 1; i >= 0; i--) {
      let next: Node<K, V> = node.nexts[i];
      while (next && next.key < key) {
        node = next;
      }
      if (next && next.key == key) {
        return next.value;
      }
    }

    return null;
  }

  remove(key: K): V | null {
    this.keyCheck(key);
    let exist = false;
    let node: Node<K, V> = this.first;
    let prevNodes: Node<K, V>[] = new Array(this.level);
    for (let i = this.level - 1; i >= 0; i--) {
      let next: Node<K, V> = node.nexts[i];
      while (next && next.key < key) {
        node = next;
      }
      if (next && next.key == key) {
        exist = true;
      }
      prevNodes[i] = node;
    }

    if (!exist) {
      return null;
    }

    this._size--;
    let removedNode = node.nexts[0];

    // 设置后继
    for (let i = 0; i < removedNode.nexts.length; i++) {
      prevNodes[i].nexts[i] = removedNode.nexts[i];
    }

    // 更新跳表的层数
    let newLevel: number = this.level;
    while (--newLevel >= 0 && !this.first.nexts[newLevel]) {
      this.level = newLevel;
    }

    return removedNode.value;
  }
}

class Node<K, V> {
  key: K;
  value: V;
  nexts: Node<K, V>[];
  constructor(key: K, value: V, level: number) {
    this.key = key;
    this.value = value;
    this.nexts = new Array(level);
  }
};

export default SkipList;
