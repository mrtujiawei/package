/**
 *  二叉索引树 | 树状数组 | Fenwick 树
 *  Peter M. Fenwick 发明
 *
 * @filename: /utils/src/data-structure/BinaryIndexedTree.ts
 * @author: Mr Prince
 * @date: 2022-05-27 16:36:34
 */
class BinaryIndexedTree {
  values: number[];

  constructor(length: number) {
    this.values = new Array(length).fill(0);
  }

  private get length() {
    return this.values.length;
  };

  private lowbit(k: number) {
    return k & (-k);
  }

  /**
   * 下标 index 处，增加 value
   */
  increment(index: number, value: number) {
    while (index <= this.length) {
      this.values[index] += value;
      index += this.lowbit(index);
    }
  }

  /**
   * 求 [0, endIndex] 之间的所有数的合
   */
  getSum(endIndex: number) {
    let sum = 0;
    while (0 < endIndex) {
      sum += this.values[endIndex];
      endIndex -= this.lowbit(endIndex);
    }
    return sum;
  }
}

export default BinaryIndexedTree;

