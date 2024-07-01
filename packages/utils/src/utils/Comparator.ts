class Comparator<T> {
  private static readonly MINUS_ONE = -1;

  private static readonly ZERO = 0;

  private static readonly ONE = 1;

  /**
   * @param compare - 比较函数
   */
  constructor(private compare: (a: T, b: T) => number) {}

  /**
   * 判断是否相等
   */
  equal(a: T, b: T) {
    return this.compare(a, b) === Comparator.ZERO;
  }

  /**
   * 判断是否不想等
   */
  notEqual(a: T, b: T) {
    return !this.equal(a, b);
  }

  /**
   * a < b ? true : false
   */
  lessThan(a: T, b: T) {
    return this.compare(a, b) < Comparator.ZERO;
  }

  /**
   * a > b ? true : false
   */
  greaterThan(a: T, b: T) {
    return this.compare(a, b) > Comparator.ZERO;
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

  /**
   * value == 0 ? true | false
   */
  isZero(value: T) {
    return value == Comparator.ZERO;
  }

  /**
   * value == 1 ? true : false
   */
  isOne(value: T) {
    return value == Comparator.ONE;
  }

  /**
   * value == -1 ? true : false
   */
  isMinusOne(value: T) {
    return value == Comparator.MINUS_ONE;
  }
}

export default Comparator;
