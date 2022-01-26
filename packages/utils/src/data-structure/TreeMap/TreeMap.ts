import RBTree, { TreeNode } from '../RBTree/index';
import { KeyValuePolicy } from '../RBTree/policy';

class TreeMap {
  __t: RBTree = new RBTree();
  constructor(iterable?: any) {
    this.__t.valuePolicy = new KeyValuePolicy();
    if (iterable !== undefined && iterable !== null) {
      if (iterable[Symbol.iterator] !== undefined) {
        for (let [k, v] of iterable) {
          this.set(k, v);
        }
      } else {
        throw new Error('iterable 不支持迭代');
      }
    }
  }

  /**
   * "[object TreeMap]"
   * Object.prototype.toString.call(new TreeMap());
   */
  get [Symbol.toStringTag]() {
    return 'TreeMap';
  }

  /**
   * 允许获取构造函数
   * @example
   * let map = new TreeMap();
   * let constrFunc = Object.getPrototypeOf(map).constructor[Symbol.species];
   * let map2 = new constrFunc();
   * @returns constructor object for this class.
   */
  static get [Symbol.species]() {
    return TreeMap;
  }

  clear() {
    this.__t.clear();
  }

  delete(key: any) {
    let it = this.__t.find(key);
    if (!it.equals(this.__t.end())) {
      this.__t.erase(it.node as TreeNode);
    }
  }

  /**
   * 获取迭代器
   */
  entries() {
    return this.__t.entries();
  }

  forEach(callback: (value: any, key: any, instance: TreeMap) => any) {
    // TODO 检查是否有生成迭代器的函数
    // @ts-ignore
    for (let [k, v] of this.__t) {
      callback(v, k, this);
    }
  }

  get(key: any) {
    let it = this.__t.find(key);
    if (!it.equals(this.__t.end())) {
      return it.value;
    } else {
      return undefined;
    }
  }

  has(key: any) {
    let it = this.__t.find(key);
    if (!it.equals(this.__t.end())) {
      return true;
    } else {
      return false;
    }
  }

  keys() {
    return this.__t.keys();
  }

  set(key: any, value: any) {
    let n = new TreeNode();
    n.key = key;
    n.value = value;
    this.__t.insertOrReplace(n);
  }

  get size() {
    return this.__t.size;
  }

  values() {
    return this.__t.values();
  }

  [Symbol.iterator]() {
    return this.__t[Symbol.iterator]();
  }

  /*======================================================
   * More methods
   *======================================================*/
  /**
   * ES6 reverse iterator for all key-value pairs in descending order of the keys.
   * @example
   * let map = new TreeMap([[1, 'A'], [2, 'B'], [3, 'C']]);
   * for (let [key,value] of map.backwards()) {
   *   console.log(`key: ${key}, value: ${value}`);
   * }
   */
  backward() {
    return this.__t.backward();
  }

  /**
   * Sets custom comparison function if key values are not of primitive types.
   * Callback is a 3-way comparison function accepts two key values (lhs, rhs). It is expected to return
   *      +1 if the value of rhs is greater than lhs
   *      -1 if the value of rhs is less than lhs
   *       0 if values are the same
   */
  set compareFunc(func: any) {
    this.clear();
    this.__t.compare = func;
  }

  /*======================================================
   * STL-like methods
   *======================================================*/

  begin() {
    return this.__t.begin();
  }

  end() {
    return this.__t.end();
  }

  find(key: any) {
    return this.__t.find(key);
  }

  insertUnique(key: any, value: any) {
    let n = new TreeNode();
    n.key = key;
    n.value = value;
    return this.__t.insertUnique(n);
  }

  insertOrReplace(key: any, value: any) {
    let n = new TreeNode();
    n.key = key;
    n.value = value;
    return this.__t.insertOrReplace(n);
  }

  erase(iterator: any) {
    this.__t.erase(iterator.node);
  }

  lowerBound(key: any) {
    return this.__t.lowerBound(key);
  }

  rbegin() {
    return this.__t.rbegin();
  }

  rend() {
    return this.__t.rend();
  }

  upperBound(key: any) {
    return this.__t.upperBound(key);
  }

  first() {
    return this.__t.first();
  }

  last() {
    return this.__t.last();
  }

  toString() {
    return this.__t.toString();
  }
}

export default TreeMap;
