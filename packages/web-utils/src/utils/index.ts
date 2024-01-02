/**
 * 工具的工具
 * @filename: packages/web-utils/src/utils/index.ts
 * @author: Mr Prince
 * @date: 2022-02-28 14:24:52
 */
import copy from 'copy-to-clipboard';
import { readAsArrayBuffer, readAsDataURL } from './fileReader';

export const canUseDOM: boolean = !!(
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
);

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
 * @param scriptSrc - 脚本地址
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
export const downloadBlob = (url: string, filename: string) => {
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
      return `${key}=${value}`;
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
    // 支持跨域图片
    img.crossOrigin = '*';
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
 * @deprecated replace with readAsDataURL
 *
 * 转dataurl
 * file 也是一个Blob对象
 * 转base64
 */
export const readBlobAsDataURL = readAsDataURL;

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

/**
 * base64 资源 转换成 blob
 */
export const dataURLToBlob = (dataURL: string) => {
  const datas = dataURL.split(',');
  const mime = datas[0].match(/:(.*?);/)![1];
  const base64Data = window.atob(datas[1]);
  let length = base64Data.length;
  const uint8Array = new Uint8Array(length);
  while (length--) {
    uint8Array[length] = base64Data.charCodeAt(length);
  }
  return new Blob([uint8Array], { type: mime });
};

/**
 * blob转当前网页中可用的url
 */
export const blobToUrl = (blob: Blob) => {
  return URL.createObjectURL(blob);
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer, mime: string) => {
  const data = String.fromCharCode(...new Uint8Array(buffer));
  return `data:${mime};base64,${window.btoa(data)}`;
};

export const arrayBufferToBlob = (buffer: ArrayBuffer, mime: string) => {
  return new Blob([buffer], { type: mime });
};

/**
 * @deprecated replace with readAsArrayBuffer
 */
export const blobToArrayBuffer = readAsArrayBuffer;

export const blobToFile = (blob: Blob, filename: string, mime: string) => {
  const file = new File([blob], filename, { type: mime });
  return file;
};

/**
 * 阻止事件冒泡
 */
export function stopPropagation(event: Event) {
  event.stopPropagation();
}

/**
 * 阻止默认事件
 */
export function preventDefault(event: Event, isStopPropagation?: boolean) {
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }

  if (isStopPropagation) {
    stopPropagation(event);
  }
}

/**
 * 获取滚动高度
 */
export function getElementScrollTop(el: HTMLElement | Window): number {
  const top =
    'scrollTop' in el
      ? el.scrollTop
      : (el['pageYOffset' as any] as unknown as number);

  // IOS 滚动式会出现负数
  return Math.max(top, 0);
}

const overflowScrollReg = /scroll|auto|overlay/i;

/**
 * 获取最近的滚动容器
 */
export function getScroller(
  el: HTMLElement,
  root: HTMLElement | Window = window
) {
  let node = el;

  while (
    node &&
    node.tagName !== 'HTML' &&
    node.tagName !== 'BODY' &&
    node.nodeType === 1 &&
    node !== root
  ) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY)) {
      return node;
    }
    node = node.parentNode as HTMLElement;
  }

  return root;
}

/**
 * 图片加载
 */
export const loadImage = (src: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = image.onabort = reject;
    image.src = src;
  });
};

/**
 * 图片翻转恢复
 * 如果没有翻转，则保持不变
 * 翻转的效果并不是特别好
 *
 * 需要图片上传之前调用
 *
 *
 * @returns 经过反转后的图片 dataURL
 */
export const rotateRecover = async (file: File, orientation: number) => {
  const dataUrl = await readAsDataURL(file);
  const image = await loadImage(dataUrl);
  // const orientation = await getOrientation(image);
  // 不需要真的放到页面上去
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!orientation || orientation == 1) {
    canvas.width = image.width;
    canvas.height = image.height;
    context?.drawImage(image, 0, 0, image.width, image.height);
  } else if (orientation == 3) {
    canvas.width = image.width;
    canvas.height = image.height;
    context?.rotate(Math.PI);
    context?.drawImage(
      image,
      -image.width,
      -image.height,
      image.width,
      image.height
    );
  } else if (orientation == 6) {
    canvas.width = image.height;
    canvas.height = image.width;
    context?.rotate(Math.PI / 2);
    context?.drawImage(image, 0, -image.height, image.width, image.height);
  } else if (orientation == 8) {
    canvas.width = image.height;
    canvas.height = image.width;
    context?.rotate((3 * Math.PI) / 2);
    context?.drawImage(image, -image.width, 0, image.width, image.height);
  }
  const url = canvas.toDataURL();

  return url;
};

/**
 * 查询是否是竖屏
 *
 * 通过判断最大宽度是600是否满足
 *
 * @returns true -> 竖屏, false -> 横屏
 */
export const isPortrait = () => {
  const mql = matchMedia('(max-width: 600px)');
  return mql.matches;
};

/**
 * 媒体查询
 *
 * @returns 解除事件监听
 */
export const isPortraitCallback = (callback: (matches: boolean) => void) => {
  const mql = matchMedia('(max-width: 600px)');
  const eventHandler = (event: MediaQueryListEvent) => {
    callback(event.matches);
  };
  mql.addEventListener('change', eventHandler);

  callback(mql.matches);

  return () => {
    mql.removeEventListener('change', eventHandler);
  };
};

/**
 * 媒体查询
 *
 * 判断是否符合查询条件
 */
export const mediaQuery = (query: string) => {
  const mql = matchMedia(query);
  return mql.matches;
};

/**
 * requestAnimFrame 兼容版本
 */
export const requestAnimFrame =
  requestAnimationFrame ||
  window['webkitRequestAnimationFrame' as any] ||
  window['mozRequestAnimationFrame' as any] ||
  window['oRequestAnimationFrame' as any] ||
  window['msRequestAnimationFrame' as any] ||
  ((callback: FrameRequestCallback) => {
    return window.setTimeout(callback, 1000 / 60);
  });

/**
 * 耗时任务监听
 */
export const observe = () => {
  const observer = new PerformanceObserver((list) => {
    console.log(list);
    const perfEntries = list.getEntries();
    console.log(perfEntries);
    for (var i = 0; i < perfEntries.length; i++) {
      console.log(perfEntries[i]);
    }
  });

  observer.observe({ entryTypes: ['longtask'] });

  // setTimeout(() => {
  //   let x = 0;
  //   for (let i = 0; i < 29900000; i++) {
  //     x += Math.random() * i;
  //   }
  //
  //   console.log({ x });
  // }, 1000);

  return () => {
    observer.disconnect();
  };
};

/**
 * 监听 DOM 变换
 */
export const observeDOM = (el: Element) => {
  const observer = new MutationObserver((mutations) => {
    console.log(mutations);
  });

  observer.observe(el);

  return () => {
    observer.disconnect();
  };
};

export const longPress = (
  el: Element,
  callback: () => void,
  options = { timeout: 500 }
) => {
  const timeout = options.timeout || 500;
  let timer: number | NodeJS.Timeout | null = null;
  const startHandler = (event: Event) => {
    if (event.type == 'click' && (event as MouseEvent).button != 0) {
      return;
    }
    if (timer == null) {
      timer = setTimeout(() => {
        callback();
      }, timeout);
    }
  };

  const cancelHandler = () => {
    if (timer != null) {
      clearTimeout(timer as any);
      timer = null;
    }
  };

  const startEvents = ['mousedown', 'touchstart'];
  const cancelEvents = ['click', 'mouseout', 'touchend', 'touchcancel'];

  startEvents.forEach((event) => {
    el.addEventListener(event, startHandler);
  });

  cancelEvents.forEach((event) => {
    el.addEventListener(event, cancelHandler);
  });

  return () => {
    cancelHandler();
    startEvents.forEach((event) => {
      el.removeEventListener(event, startHandler);
    });
    cancelEvents.forEach((event) => {
      el.removeEventListener(event, cancelHandler);
    });
  };
};

/**
 * 图片压缩
 * 只对 jpeg 有好的效果
 */
export const compressImage = async (
  file: File,
  options: { quality: number }
) => {
  if (file.type != 'image/jpeg') {
    return file;
  }
  const img = await loadImage(URL.createObjectURL(file));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const width = img.width;
  const height = img.height;
  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.drawImage(img, 0, 0, width, height);
  const dataUrl = canvas.toDataURL(file.type, options.quality);

  // 前后的filetype不一样了，说明压缩失败
  if (!new RegExp(`^data:${file.type};base64,`).test(dataUrl)) {
    return file;
  }
  const blob = dataURLToBlob(dataUrl);
  const newFile = new File([blob], file.name, {
    type: file.type,
    lastModified: file.lastModified,
  });
  return newFile;
};

/**
 * 判断是否按下了 Enter
 */
export const pressEnter = (event: KeyboardEvent) => {
  return event.key == 'Enter';
};

/**
 * 图片地址转换成 file
 * @param url 图片地址 https://xxx
 * @param filename 文件名
 */
export const imgUrlToFile = async (url: string, filename: string) => {
  const img = await loadImage(url);
  img.crossOrigin = 'anonymous';
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const context = canvas.getContext('2d');

  context?.drawImage(img, 0, 0, img.width, img.height);
  const blob = await new Promise<Blob>((resolve) => {
    canvas?.toBlob((blob) => {
      resolve(blob!);
    });
  });

  return blobToFile(blob, filename, blob.type);
};

/**
 * 刷新页面后回到顶部，不滚动到原来的位置
 */
export const restoration = () => {
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }
};

/**
 * 停止滚动
 */
export const stopScroll = (el?: HTMLElement) => {
  el = getScroller(el || document.body) as HTMLElement;
  const overflow = el.style.overflow;

  const unstop = () => {
    (el as HTMLElement).style.overflow = overflow;
  };

  return unstop;
};
