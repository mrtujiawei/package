/**
 * 计数器
 * @filename: packages/utils/src/utils/Counter.ts
 * @author: Mr Prince
 * @date: 2022-10-10 17:47:54
 */

class Counter {
  /**
   * @param start 开始位置
   * @param step 步长， 每次 start = start + step
   */
  constructor(private start: number = 0, private step: number = 1) {}

  next() {
    this.start += this.step;
    return this.start;
  }
}

export default Counter;
