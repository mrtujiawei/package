/**
 * 计数器
 * @filename: packages/utils/src/utils/Counter.ts
 * @author: Mr Prince
 * @date: 2022-10-10 17:47:54
 */

class Counter {
  private offset: number = 0;

  /**
   * @param start 开始位置
   * @param step 步长， 每次 start = start + step
   */
  constructor(private start: number = 0, private step: number = 1) {}

  /**
   * 获取当前值
   */
  getCurrent() {
    return this.start + this.offset;
  }

  /**
   * 更新step值
   */
  setStep(step: number = 1) {
    this.step = step;
  }

  /**
   * 获取下一个值并更新为当前值
   */
  next() {
    this.offset += this.step;
    return this.getCurrent();
  }

  /**
   * 获取前一个值并更新为前一个值
   */
  prev() {
    this.offset -= this.step;
    return this.getCurrent();
  }

  /**
   * 回到初始位置
   */
  reset() {
    this.offset = 0;
    return this.getCurrent();
  }
}

export default Counter;
