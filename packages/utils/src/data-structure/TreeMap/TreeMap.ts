/**
 * TreeMap 红黑树实现版
 * @filename: src/data-structure/TreeMap.ts
 * @author: Mr Prince
 * @date: 2022-02-08 19:26:35
 */
import RBTree from '../Tree/RBTree/Tree';

class TreeMap<K, V> {
  private tree: RBTree<K, V>;

  get size() {
    return this.tree.getSize();
  }

  constructor(comparator: (lhs: K, rhs: K) => number) {
    this.tree = new RBTree<K, V>(comparator);
  }

  has(key: K) {
    return this.tree.has(key);
  }

  get(key: K) {
    return this.tree.getValue(key);
  }

  set(key: K, value: V) {
    this.tree.insertOrReplace(key, value);
  }

  forEach(callback: (value: V, key: K) => any) {
    this.tree.forEach(callback);
  }

  delete(key: K) {
    this.tree.remove(key);
  }

  clear() {
    this.tree.clear();
  }

  /**
   * @deprecated 不想写
   */
  keys() {
    return [];
  }

  /**
   * @deprecated 不想写
   */
  values() {
    return [];
  }

  /**
   * @deprecated 不想写
   */
  entries() {
    return [];
  }
}

export default TreeMap;
