/**
 * 并查集
 * quick union
 * @filename: UnionFind.ts
 * @author: Mr Prince
 * @date: 2021-06-06 18:38:53
 */
class UnionFind {
  static IllegaleArgumentException = class IllegaleArgumentException extends Error {
    constructor(message: string = 'Capacity is invalid') {
      super(message);
    }
  }

  private parents: number[];

  constructor(capacity: number) {
    if (capacity < 0) {
      throw new UnionFind.IllegaleArgumentException();
    }

    this.parents = new Array(capacity);
    
    for (let i = 0; i < capacity; i++) {
      this.parents[i] = i;
    }
  }

  private rangeCheck(value: number): void {
    if (0 > value || value >= this.parents.length) {
      throw new UnionFind.IllegaleArgumentException('Node value is invalid');
    }
  }

  // 路径压缩，find时该路径上的所有结点都指向根节点
  // if (value != this.parents[value]) {
  //   this.parents[value] = this.find(parents[value]);
  // }
  /**
   * 查找集合的根节点
   */
  find(value: number): number {
    this.rangeCheck(value);
    if (value == this.parents[value]) {
      return value;
    }
    return this.find(this.parents[value]);
  }

  /**
   * 合并所属集合
   */
  union(value1: number, value2: number): void {
    this.rangeCheck(value1);
    this.rangeCheck(value2);
    this.parents[value1] = this.parents[value2];
  }

  /**
   * quick find union
   */
  // private quickFindUnion(value1: number, value2: number): void {
  //   this.rangeCheck(value1);
  //   this.rangeCheck(value2);
  //   let parent1 = this.find(value1);
  //   let parent2 = this.find(value2);
  //   if (parent1 == parent2) {
  //     return ;
  //   }
  //   for (let i = 0; i < this.parents.length; i++) {
  //     if (this.parents[i] == parent1) {
  //       this.parents[i] = parent2;
  //     }
  //   }
  // }
  
  /**
   * 是否属于同一集合
   */
  isSame(value1: number, value2: number): boolean {
    this.rangeCheck(value1);
    this.rangeCheck(value2);
    return this.find(value1) == this.find(value2);
  }
}

export default UnionFind;
