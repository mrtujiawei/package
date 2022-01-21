/**
 * 按钮效果
 *
 * 注意:
 *  目标元素需要定位,切overflow hidden
 *  需要手动释放
 *
 * Demo:
 *  let className = '.btn';
 *  let ripple = new Ripple(className);
 *  ripple.addEvent();
 *
 *  // 释放
 *  ripple.remove();
 */
class Ripple {
  /**
   * 是否需要初始化
   */
  private static inited = false;

  /**
   * 经过 clearTime ms后移除内部元素
   */
  private readonly clearTime = 500;

  /**
   * 元素类名
   */
  private className: string;

  /**
   * 添加效果的元素
   */
  private element?: HTMLElement;

  /**
   * 保存添加的函数, 方便后期移除
   */
  private callback?: (event: MouseEvent) => any;

  constructor(className: string) {
    this.className = className;
    this.init();
  }

  private init() {
    if (Ripple.inited) {
      return;
    }
    Ripple.inited = true;
    this.initStyle();
  }

  /**
   * 初始化样式
   */
  private initStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
      .ripple-spin {
        width: 10px;
        height: 10px;
        background: #fff;
        position: absolute;
        border-radius: 50%;
        animation: ripple-wave ${this.clearTime / 1000}s ease-out;
        opacity: 0;
        transform: scale(50);
        animation-fill-mode: forwards;
        pointer-events: none;
      }

      @keyframes ripple-wave {
        from {
          opacity: 0.3;
          transform: scale(0);
        }

        to {
          opacity: 0;
          transform: scale(50);
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 获取目标元素
   */
  private getTargetElement() {
    if (this.element) {
      return this.element;
    }
    let element = document.querySelector(this.className) as HTMLElement;
    if (!element) {
      throw new Error('Element not found');
    }
    this.element = element;
    return element;
  }

  /**
   * 添加事件
   */
  addEvent() {
    if (this.callback) {
      return;
    }
    const element = this.getTargetElement();
    let callback = (e: MouseEvent) => {
      const span = document.createElement('span');
      span.className = 'ripple-spin';
      span.style.left = e.offsetX + 'px';
      span.style.top = e.offsetY + 'px';
      element.appendChild(span);
      setTimeout(() => {
        element.removeChild(span);
      }, this.clearTime);
    };
    element.addEventListener('click', callback);
    this.callback = callback;
  }

  remove() {
    if (this.element && this.callback) {
      this.element.removeEventListener('click', this.callback);
      this.callback = void 0;
    }
  }
}

export default Ripple;
