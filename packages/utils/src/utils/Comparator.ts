class Comparator<T> {
  /**
   * @param compare - 比较函数
   */
  constructor(private compare: (a: T, b: T) => number) {}

  /**
   * 判断是否相等
   */
  equal(a: T, b: T) {
    return this.compare(a, b) === 0;
  }

  /**
   * a < b ? true : false
   */
  lessThan(a: T, b: T) {
    return this.compare(a, b) < 0;
  }

  /**
   * a > b ? true : false
   */
  greaterThan(a: T, b: T) {
    return this.compare(a, b) > 0;
  }

  /**
   * a <= b ? true : false
   */
  lessThanOrEqual(a: T, b: T) {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  /**
   * a >= b ? true : false
   */
  greaterThanOrEqual(a: T, b: T) {
    return this.greaterThan(a, b) || this.equal(a, b);
  }
}

export default Comparator;
