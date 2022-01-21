/**
 * TreeSet 红黑树实现版
 * @filename: utils/src/data-structure/TreeSet.ts
 * @author: Mr Prince
 * @date: 2022-02-11 16:09:19
 */
import RBTree from '../Tree/RBTree/Tree';

class TreeMap<T> {
  private tree: RBTree<T, undefined>;

  get size() {
    return this.tree.getSize();
  }

  constructor(comparator: (lhs: T, rhs: T) => number) {
    this.tree = new RBTree<T, undefined>(comparator);
  }

  has(key: T) {
    return this.tree.has(key);
  }

  add(value: T) {
    this.tree.insertOrReplace(value, undefined);
  }

  forEach(callback: (value: T) => any) {
    this.tree.forEach((_, key) => {
      callback(key);
    });
  }

  delete(key: T) {
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
