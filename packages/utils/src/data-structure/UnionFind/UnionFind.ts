/**
 * 并查集
 * @filename: UnionFind.ts
 * @author: Mr Prince
 * @date: 2021-06-06 18:38:53
 */
class UnionFind {
  static IllegaleArgumentException = class IllegaleArgumentException extends Error {
    constructor(message: string = 'Capacity is invalid') {
      super(message);
    }
  };

  private parents: number[];

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new UnionFind.IllegaleArgumentException();
    }

    this.parents = Array.from({ length: capacity }, (_, i) => i);
  }

  /**
   * 检查范围是否合理
   */
  private rangeCheck(value: number): void {
    if (0 > value || value >= this.parents.length) {
      throw new UnionFind.IllegaleArgumentException('Node value is invalid');
    }
  }

  /**
   * 查找集合的根节点
   */
  find(value: number): number {
    this.rangeCheck(value);
    if (value == this.parents[value]) {
      return value;
    }
    const parent = this.find(this.parents[value]);
    this.parents[value] = parent;
    return parent;
  }

  /**
   * 合并所属集合
   * 合并时会压缩路径
   */
  union(value1: number, value2: number): void {
    this.rangeCheck(value1);
    this.rangeCheck(value2);
    const p1 = this.find(value1);
    const p2 = this.find(value2);
    this.parents[p1] = this.parents[p2];
  }

  /**
   * 是否属于同一集合
   */
  isUnion(value1: number, value2: number) {
    return this.isBelongSameUnion(value1, value2);
  }

  /**
   * 是否属于同一集合
   */
  isBelongSameUnion(value1: number, value2: number): boolean {
    this.rangeCheck(value1);
    this.rangeCheck(value2);
    return this.find(value1) == this.find(value2);
  }
}

export default UnionFind;
