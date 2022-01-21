import LocalData from './LocalData';
import Tween from './Tween';
import Ripple from './Ripple';
import { debounce, } from '@mrtujiawei/utils';
import isCorrespondingPlatform from './Platform';

const webUtils = {
  Tween: Tween,
  LocalData: LocalData,
  Ripple: Ripple,
  isCorrespondingPlatform: isCorrespondingPlatform,

  /**
   * 判断浏览器支不支持css属性
   *
   * example:
   *  CSS.supports('transform-origin', '5px');
   *  CSS.supports('display: table-cell');
   *
   * @param {string} property
   * @returns {boolean}
   */
  isCssPropertySupported(property) {
    // 原生支持
    if (property in document.body.style) {
      return true;
    }

    // 浏览器特性支持
    let prefixes = ['Moz', 'Webkit', 'O', 'ms', 'Khtml'];
    let prefProperty = property.charAt(0).toUpperCase() + property.slice(1);

    for (let i = 0; i < prefixes.length; i++){
      if((prefixes[i] + prefProperty) in document.body.style) {
        return true;
      }
    }

    return false;
  },

  /**
   * 获取元素的属性, 不止能获取行间
   *
   * @param {HTMLElement} element - 要获取属性的元素
   * @param {string} attribute - 要获取的属性
   * @returns {string|undefined}
   */
  getStyle(element, attribute){
    if(element.currentStyle){
      return element.currentStyle[attribute];
    } else {
      return document.defaultView.getComputedStyle(element,null)[attribute];
    }
  },

  /**
   * 元素相对于整张网页的坐标
   *
   * @param {HTMLElement} element - 要获取位置的元素
   * @returns {{x: number, y: number}}
   */
  getElementPosition(element) {
    let x = 0;
    let y = 0;

    while (null != element)  {
      x += element.offsetLeft;
      y += element.offsetTop;
      e = e.offsetParent;
    }

    return {x, y};
  },

  /**
   * 获取滚动的高度
   *
   * @returns {number}
   */
  getScrollTop() {
    return document.documentElement.scrollTop ||  document.body.scrollTop;
  },

  /**
   * 判断是否是IE8以下版本
   * @returns {boolean}
   */
  isLessThenIE8() {
    return !+"\v1";
  },

  /**
   * 异步加载js脚本
   *
   * @param {string} url - 脚本地址
   * @returns {Promise<void>}
   */
  loadScript(scriptSrc) {
    return new Promise((resolve, reject) => {
      let script = document.createElement('script');
      if (script.readyState) {
        // 改变的时候触发  IE才有
        script.onreadystatechange = () => {
          if ('complete' == script.readyState || 'loaded' == script.readyState) {
            resolve();
          }
        };
      } else {
        // IE没有
        script.onload = () => {
          resolve();
        };
      }
      script.onerror = reject;

      // 可能加载的速度非常快，状态不会发生改变
      // 所以需要在下面加载
      script.src = scriptSrc;
      document.body.appendChild(script);
    });
  },

  /**
   * 触发下载
   *
   * @param {string} url - 下载的blob地址
   * @param {string} filename - 下载的文件名
   * @returns {void}
   */
  downloadBlob(url, filename) {
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();

    // 释放资源
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * 将一个函数转换成一个立即调用的地址
   * 主要是为了 new Worker(url)
   * 需要注意函数不能是 native code
   *
   * 执行流程:
   *  1. 函数转字符串
   *  2. 将函数转换成IIFE
   *  3. 通过new Blob生成地址
   *
   * @param {function} func
   * @returns {string}
   */
  createScriptUrl(func) {
    return URL.createObjectURL(new Blob([`(${func.toString()})();`]));
  },

  /**
   * 滚动锁定
   * 需要提前写好:
   * .modal-open {
   *   position: fixed;
   * }
   *
   * @typedef {object} ScrollCtrl
   * @property {function} ScrollCtrl.stopScroll - 进入遮罩层，禁止滑动
   * @property {function} ScrollCtrl.allowScroll - 取消滑动限制
   *
   * @returns {ScrollCtrl}
   */
  getScrollCtrl() {
    const bodyClass = 'modal-open';
    let position = webUtils.getStyle(document.body, 'position');
    if ('fixed' != position) {
      throw new Error(`body's position is not fixed.`);
    }
    let scrollTop;
    const ModalHelper = {
      afterOpen() {
        scrollTop = webUtils.getScrollTop();
        document.body.classList.add(bodyClass);
        document.body.style.top = -scrollTop + 'px';
      },
      beforeClose() {
        document.body.classList.remove(bodyClass);
        document.scrollingElement.scrollTop = scrollTop;
      }
    };

    return {
      stopScroll() {
        ModalHelper.afterOpen();
      },
      allowScroll() {
        ModalHelper.beforeClose()
      },
    };
  },

  /**
   * 移动端全面禁止默认事件
   * 在需要的地方 ev.stopPropagation();
   */
  preventDefaultEvent() {
    const callback = ev => {
      ev = ev || window.event;
      ev.preventDefault();
    };

    const options = {
      passive: false,
    };

    document.addEventListener('touchstart', callback, options);
  },

  /**
   * rem适配
   * 需要在页面上先写好:
   * <meta name="viewport" content="width=device-width,init-scale=1.0,maximum-scale=1.0,minimum-scle=1.0,user-scalable=no, viewport-fit=cover">
   *
   * @param  {number} [num = 10] - 宽度为多少rem.
   * @param {number} [timeout = 100] - 延时 timeout ms 后调整
   * @returns {function} - 移除适配
   */
  remAdaptation(num = 10, timeout = 100) {
    let styleNode = document.createElement('style');
    let adjust = () => {
      styleNode.innerHTML = `html{font-size: ${document.documentElement.clientWidth / num}px !important;}`;
    };
    let debounceAdjust = debounce(adjust, timeout);

    adjust();
    document.head.appendChild(styleNode);
    addEventListener('resize', debounceAdjust);

    return () => {
      removeEventListener('resize', debounceAdjust);
      document.head.removeChild(styleNode);
      styleNode = null;
    };
  },

  /**
   * viewport 适配
   * 需要提前在页面上写好:
   * <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no,viewport-fit=cover">
   * 因为innerWidth等兼容性太差
   * 用viewport 适配后,1px 就是1物理像素
   *
   * @param {number} [targetWidth = 750] - 设计图的宽度
   * @param {number} [timeout = 100] - 延时 timeout ms 后调整
   * @returns {function} - 移除适配方案
   */
  viewportAdaptation(targetWidth = 750, timeout = 100) {
    let viewport = document.querySelector('meta[name=viewport]');
    let originViewportContent = viewport.content;
    let adjust = () => {
      viewport.content = originViewportContent;
      let clientWidth = document.documentElement.clientWidth;
      let scale = clientWidth / targetWidth;
      viewport.content = `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no, viewport-fit=cover`;
    };
    let debounceAdjust = debounce(adjust(), timeout);

    adjust();
    addEventListener('resize', debounceAdjust);

    return () => {
      viewport.content = originViewportContent;
      viewport = null;
      removeEventListener('resize', debounceAdjust);
    };
  },

  /**
   * 1物理像素实现
   * rem 与原来相同
   * 1px 就是1物理像素
   * 保留完美视口
   *
   * @param {number} [num = 10] - rem
   * @param {number} [timeout = 100] - resize after timeout ms 后重新调整
   * @returns {function} 资源释放，状态恢复
   */
  remAndViewportAdaptation(num = 10, timeout = 100) {
    let dpr = window.devicePixelRatio || 1;
    let scale = 1 / dpr;
    let styleNode = document.createElement('style');
    let meta = document.querySelector('meta[name=viewport');
    let originMeta = meta;
    if (!meta) {
      // 如果meta标签不存在
      meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no,viewport-fit=cover';
      document.head.appendChild(meta);
    }
    document.head.appendChild(styleNode);
    let originViewportContent = meta.content;

    let adjust = () => {
      meta.content = originViewportContent;
      let fontSize = document.documentElement.clientWidth * dpr / num;
      styleNode.innerHTML = `html{font-size: ${fontSize}px !important;}`;
      meta.content = `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no,viewport-fit=cover`;
    };
    let debounceAdjust = debounce(adjust, timeout);

    adjust();
    addEventListener('resize', debounceAdjust);

    return () => {
      viewport.content = originViewportContent;
      viewport = null;
      removeEventListener('resize', debounceAdjust)
      if (originMeta != meta) {
        document.head.removeChild(meta);
      }
    };
  },

  /**
   * 处理url请求参数
   *
   * @param {object} params
   * @returns {string}
   */
  objectToUrlParams(params) {
    let urlParams = Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
    return encodeURI(urlParams);
  },

  /**
   * 请求参数转对象
   *
   * @param {String} urlParams - 以 ？开头的url请求参数
   * @returns {Object}
   */
  urlParamsToObject(urlParams) {
    urlParams = decodeURIComponent(urlParams);
    return urlParams.slice(1).split('&')
      .map(entry => entry.split('='))
      .reduce((params, [key, value]) => {
        params[key] = value;
        return params;
      }, {});
  },

  async imgSrcToBase64Uri(src) {
    const img = new Image();
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const width = img.width;
        const height = img.height;
        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height)

        const base64Str = canvas.toDataURL('image/jpeg').split(',')[1];
        resolve(base64Str);
      };
      img.onerror = reject;
      img.src = src;
    });
  },

  /**
   * 复制到剪切板
   */
  copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  },

  /**
   * 转dataurl
   * file 也是一个Blob对象
   * 转base64
   */
  async readBlobAsDataURL(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(blob);
    });
  },

  /**
   * 获取元素
   */
  getElement(selector) {
    if (typeof '' == typeof selector) {
      return document.querySelector(selector);
    } else {
      return selector;
    }
  },
};

export default webUtils;
