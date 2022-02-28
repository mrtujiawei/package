/**
 * 工具的工具
 * @filename: packages/web-utils/src/utils/index.ts
 * @author: Mr Prince
 * @date: 2022-02-28 14:24:52
 */
import copy from 'copy-to-clipboard';

/**
 * 判断浏览器支不支持css属性
 *
 * example:
 *  CSS.supports('transform-origin', '5px');
 *  CSS.supports('display: table-cell');
 *
 * @param property
 * @returns
 */
export const isCssPropertySupported = (property: string): boolean => {
  // 原生支持
  if (property in document.body.style) {
    return true;
  }

  // 浏览器特性支持
  let prefixes = ['Moz', 'Webkit', 'O', 'ms', 'Khtml'];
  let prefProperty = property.charAt(0).toUpperCase() + property.slice(1);

  for (let i = 0; i < prefixes.length; i++) {
    if (prefixes[i] + prefProperty in document.body.style) {
      return true;
    }
  }

  return false;
};

/**
 * 获取元素的属性, 不止能获取行间
 *
 * @param element - 要获取属性的元素
 * @param attribute - 要获取的属性
 */
export const getElementStyle = (
  element: HTMLElement,
  attribute: string
): string => {
  // @ts-ignore
  if (element.currentStyle) {
    // @ts-ignore
    return element.currentStyle[attribute];
  } else {
    // @ts-ignore
    return document.defaultView.getComputedStyle(element, null)[attribute];
  }
};

/**
 * 元素相对于整张网页的坐标
 *
 * @param element - 要获取位置的元素
 */
export const getElementPosition = (element: HTMLElement) => {
  let x = 0;
  let y = 0;

  while (null != element) {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent as HTMLElement;
  }

  return { x, y };
};

/**
 * 获取滚动的高度
 */
export const getScrollTop = () => {
  return document.documentElement.scrollTop || document.body.scrollTop;
};

/**
 * 判断是否是IE8以下版本
 */
export const isLessThenIE8 = () => {
  return !+'\v1';
};

/**
 * 异步加载js脚本
 *
 * @param url - 脚本地址
 */
export const loadScript = (scriptSrc: string) => {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    // @ts-ignore
    if (script.readyState) {
      // 改变的时候触发  IE才有
      // @ts-ignore
      script.onreadystatechange = () => {
        // @ts-ignore
        if ('complete' == script.readyState || 'loaded' == script.readyState) {
          resolve(void 0);
        }
      };
    } else {
      // IE没有
      script.onload = () => {
        resolve(void 0);
      };
    }
    script.onerror = reject;

    // 可能加载的速度非常快，状态不会发生改变
    // 所以需要在下面加载
    script.src = scriptSrc;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

/**
 * 触发下载
 *
 * @param url - 下载的blob地址
 * @param filename - 下载的文件名
 */
export const downloadBlob = (url: string, filename: string)  => {
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', filename);

  document.body.appendChild(link);
  link.click();

  // 释放资源
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

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
 * @param func
 */
export const createScriptUrl = (func: Function) => {
  return URL.createObjectURL(new Blob([`(${func.toString()})();`]));
};

/**
 * 移动端全面禁止默认事件
 * 在需要的地方 ev.stopPropagation();
 */
export const preventDefaultEvent = () => {
  const callback = (ev: Event) => {
    ev = ev || window.event;
    ev.preventDefault();
    return false;
  };

  const options = {
    passive: false,
  };

  document.addEventListener('touchstart', callback, options);

  return callback;
};

/**
 * 移动端允许默认事件
 * @param callback - preventDefault 的返回值
 */
export const allowDefaultEvent = (callback: (ev: Event) => any) => {
  document.removeEventListener('click', callback);
};

/**
 * 处理url请求参数
 *
 * @param params
 */
export const objectToUrlParams = (params: Object) => {
  let urlParams = Object.entries(params)
    .map(([key, value]) => {
      key = encodeURIComponent(key);
      value = encodeURIComponent(value);
      return `${key}=${value}`
    })
    .join('&');
  return encodeURI(urlParams);
};

/**
 * 请求参数转对象
 *
 * @param urlParams - 以 ？开头的url请求参数
 */
export const urlParamsToObject = (urlParams: string) => {
  // 先分割是为了防止键值对中有 '=&' 等符号
  return urlParams
    .slice(1)
    .split('&')
    .map((entry) => entry.split('='))
    .reduce((params: any, [key, value]) => {
      key = decodeURIComponent(key);
      value = decodeURIComponent(value);
      params[key] = value;
      return params;
    }, {});
};

/**
 * 图片地址转uir
 */
export const imgSrcToBase64Uri = async (src: string) => {
  const img = new Image();
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;

      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;
      context.drawImage(img, 0, 0, width, height);

      const base64Str = canvas.toDataURL('image/jpeg').split(',')[1];
      resolve(base64Str);
    };
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * 复制到剪切板
 */
export const copyToClipboard = (text: string) => {
  copy(text);
};

/**
 * 转dataurl
 * file 也是一个Blob对象
 * 转base64
 */
export const readBlobAsDataURL = async (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e && e.target) {
        resolve(e.target.result);
      } else {
        reject(new TypeError('事件类型错误'));
      }
    };
    reader.readAsDataURL(blob);
  });
};

/**
 * 获取元素
 */
export const getElement = (selector: string | HTMLElement) => {
  if (typeof '' == typeof selector) {
    return document.querySelector(selector as string);
  } else {
    return selector as HTMLElement;
  }
};
