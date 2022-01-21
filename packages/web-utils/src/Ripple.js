/**
 * 按钮效果
 *
 * 注意:
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
   * @type {boolean}
   */
  static initFlag = true;

  /**
   * 添加效果的元素
   * @type {HTMLElement}
   */
  element = null;

  /**
   * 保存添加的函数, 方便后期移除
   * @type {Function}
   */
  callback = null;

  /**
   * 经过 clearTime ms后移除内部元素
   * @type {number}
   */
  clearTime = 500;

  /**
   * 元素类名
   * @type {string}
   */
  className = '';

  constructor(className) {
    this.className = className;
    if (Ripple.initFlag) {
      Ripple.initFlag = false;
      let style = document.createElement('style');
      style.innerHTML = `
        .ripple-spin {
          width: 10px;
          height: 10px;
          background: #fff;
          position: absolute;
          border-radius: 50%;
          animation: ripple-wave .5s ease-out;
          opacity: 0;
          transform: scale(50);
          animation-fill-mode: forwards;
          pointer-events: none;
        }

        @keyframes ripple-wave {
          from {
            opacity: 0.5;
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
  }

  addEvent() {
    // 验证className是否合法，元素是否存在
    let btn = document.querySelector(this.className);
    if (!btn) {
      throw new Error('Element not found');
    }
    let callback = (e) => {
      let span = document.createElement('span');
      span.className = 'ripple-spin';
      span.style.left = e.offsetX + 'px';
      span.style.top = e.offsetY + 'px';
      btn.appendChild(span);
      setTimeout(() => {
        btn.removeChild(span);
      }, 600);
    }
    btn.addEventListener('click', callback);
    this.element = btn;
    this.callback = callback;
  }

  remove() {
    if (this.element) {
      this.element.removeEventListener('click', this.callback);
    }
  }
}

export default Ripple;
