import { debounce } from '@mrtujiawei/utils';

class Adaptation {
  /**
   * rem适配
   * 需要在页面上先写好:
   * <meta name="viewport" content="width=device-width,init-scale=1.0,maximum-scale=1.0,minimum-scle=1.0,user-scalable=no, viewport-fit=cover">
   *
   * @param num - 宽度为多少rem.
   * @param timeout - 延时 timeout ms 后调整
   * @returns - 移除所有适配
   */
  remAdaptation(num = 10, timeout = 100) {
    let styleNode = document.createElement('style');
    let adjust = () => {
      styleNode.innerHTML = `html{font-size: ${document.documentElement.clientWidth / num}px !important;}`;
    };
    let debounceAdjust = debounce(adjust, timeout);

    adjust();
    document.head.appendChild(styleNode);
    // @ts-ignore
    addEventListener('resize', debounceAdjust);

    return () => {
      // @ts-ignore
      removeEventListener('resize', debounceAdjust);
      document.head.removeChild(styleNode);
      // @ts-ignore
      styleNode = null;
    };
  }

  /**
   * viewport 适配
   * 需要提前在页面上写好:
   * <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no,viewport-fit=cover">
   * 因为innerWidth等兼容性太差
   * 用viewport 适配后,1px 就是1物理像素
   *
   * @param targetWidth - 设计图的宽度
   * @param timeout - 延时 timeout ms 后调整
   * @returns - 移除适配方案
   */
  viewportAdaptation(targetWidth = 750, timeout = 100) {
    let viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement;
    let originViewportContent = viewport.content;
    let adjust = () => {
      viewport.content = originViewportContent;
      let clientWidth = document.documentElement.clientWidth;
      let scale = clientWidth / targetWidth;
      viewport.content = `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no, viewport-fit=cover`;
    };

    let debounceAdjust = debounce(adjust, timeout);

    adjust();
    // @ts-ignore
    addEventListener('resize', debounceAdjust);

    return () => {
      viewport.content = originViewportContent;
      // @ts-ignore
      removeEventListener('resize', debounceAdjust);
      // @ts-ignore
      viewport = null;
    };
  }

  /**
   * 1物理像素实现
   * rem 与原来相同
   * 1px 就是1物理像素
   * 保留完美视口
   *
   * @param num - 宽度为 {num} rem
   * @param timeout - resize after timeout ms 后重新调整
   * @returns - 资源释放，状态恢复
   */
  remAndViewportAdaptation(num = 10, timeout = 100) {
    let dpr = window.devicePixelRatio || 1;
    let scale = 1 / dpr;
    let styleNode = document.createElement('style');
    let meta = document.querySelector('meta[name=viewport') as HTMLMetaElement;
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

    // @ts-ignore
    addEventListener('resize', debounceAdjust);

    return () => {
      meta.content = originViewportContent;
      // @ts-ignore
      meta = null;
      // @ts-ignore
      removeEventListener('resize', debounceAdjust)
      if (originMeta != meta) {
        document.head.removeChild(meta);
      }
    };
  }
}

export default Adaptation;
