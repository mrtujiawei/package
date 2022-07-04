/**
 * set相关工具
 * @filename: src/data-structure/SetEnhancer/SetEnhancer.ts
 * @author: Mr Prince
 * @date: 2022-07-03 20:42:42
 */
class SetEnhancer {
  /**
   * 并集
   */
  static union<T>(a: Set<T>, b: Set<T>) {
    const result = new Set<T>();
    a.forEach((value) => {
      result.add(value);
    });
    b.forEach((value) => {
      result.add(value);
    });
    return result;
  }

  /**
   * 交集
   */
  static intersect<T>(a: Set<T>, b: Set<T>) {
    const result = new Set<T>();
    a.forEach((value) => {
      if (b.has(value)) {
        result.add(value);
      }
    });
    return result;
  }

  /**
   * a 对 b 的补集
   * b 有的但 a 没有
   */
  static complement<T>(a: Set<T>, b: Set<T>) {
    const result = new Set<T>();
    a.forEach((value) => {
      if (!b.has(value)) {
        result.add(value);
      }
    });
    return result;
  }

  /**
   * 同 complement
   */
  static diff<T>(a: Set<T>, b: Set<T>) {
    return SetEnhancer.complement(a, b);
  }

  /**
   * b 是否是 a 的 子集
   */
  static isSubsetOf<T>(a: Set<T>, b: Set<T>) {
    for (const value of b) {
      if (!a.has(value)) {
        return false;
      }
    }
    return true;
  }

  /**
   * a 是否是 b的 超集
   */
  static isSupersetOf<T>(a: Set<T>, b: Set<T>) {
    return SetEnhancer.isSubsetOf(b, a);
  }

  /**
   * 笛卡尔积
   */
  static product<T>(a: Set<T>, b: Set<T>) {
    const result = new Set<[T, T]>();
    a.forEach((value1) => {
      b.forEach((value2) => {
        result.add([value1, value2]);
      });
    });
    return result;
  }

  /**
   * Set 的 m 次方
   */
  static power<T>(set: Set<T>, m: number) {
    if (0 > m || Math.floor(m) != m) {
      throw new Error('.power expects a positive integer');
    }
    if (0 == m) {
      return new Set<T>();
    }
    if (1 == m) {
      return SetEnhancer.clone(set);
    }
    let result = SetEnhancer.product(set, set);
    for (let i = 2; i < m; i++) {
      result = SetEnhancer.product(result, result) as any;
    }
    return result;
  }

  /**
   * 集合中的元素是否相等
   */
  static equals<T>(a: Set<T>, b: Set<T>) {
    return a.size == b.size && SetEnhancer.isSubsetOf(a, b);
  }

  /**
   * 过滤
   */
  static filter<T>(set: Set<T>, callback: (value: T) => boolean) {
    const result = new Set<T>();
    set.forEach((value) => {
      if (callback(value)) {
        result.add(value);
      }
    });
    return result;
  }

  /**
   * 转化成数组
   */
  static toArray<T>(set: Set<T>) {
    return Array.from(set);
  }

  /**
   * 复制
   */
  static clone<T>(set: Set<T>) {
    return new Set<T>(SetEnhancer.toArray(set));
  }
}

export default SetEnhancer;
