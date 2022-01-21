import { getElementStyle, getScrollTop } from ".";

enum LockStatus {
  unlock,
  lock,
};

/**
 * 滚动锁定
 * 需要提前写好:
 */
class ScrollControler {
  /**
   * 初始化是否完成
   */
  private static inited = false;

  /**
   * 状态
   */
  private static lockStatus = LockStatus.unlock;

  /**
   * 给body加的类名
   */
  private readonly bodyClass = 'modal-open';

  /**
   * 滚动高度
   */
  private scrollTop: number = 0;

  /**
   * 单例
   */
  private instance!: ScrollControler;

  private constructor() {
    const position = getElementStyle(document.body, 'position');
    if ('fixed' != position) {
      throw new Error(`body's position is not fixed.`);
    }
    if (!ScrollControler.inited) {
      this.initStyle();
      ScrollControler.inited = true;
    }
  }

  private initStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
      .modal-open {
        position: fixed;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 获取实例
   */
  getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ScrollControler();
    return this.instance;
  }

  /**
   * 滚动锁定
   */
  scrollLock() {
    if (LockStatus.lock == ScrollControler.lockStatus) {
      return;
    }
    this.scrollTop = getScrollTop();
    document.body.classList.add(this.bodyClass);
    document.body.style.top = -this.scrollTop + 'px';
    ScrollControler.lockStatus = LockStatus.lock;
  }

  /**
   * 取消滚动锁定
   */
  scrollUnlock() {
    if (LockStatus.unlock == ScrollControler.lockStatus) {
      return;
    }
    document.body.classList.remove(this.bodyClass);
    (document.scrollingElement as Element).scrollTop = this.scrollTop;
    ScrollControler.lockStatus = LockStatus.unlock;
  }
}

export default ScrollControler;
