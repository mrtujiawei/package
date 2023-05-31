/**
 * 平台判断，主要是根据 userAgent
 * @filename: packages/web-utils/src/Platform.ts
 * @author: Mr Prince
 * @date: 2022-02-28 13:52:57
 */

/**
 * 是否是安卓
 */
export const isAndroid = () => {
  return !!navigator.userAgent.match(/Android/i);
};

/**
 * 是否是黑莓
 */
export const isBlackBerry = () => {
  return !!navigator.userAgent.match(/BlackBerry/i);
};

/**
 * 是否是ios
 */
export const isIOS = () => {
  return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
};

/**
 * 是否是windows
 */
export const isWindows = () => {
  return !!navigator.userAgent.match(/IEMobile/i);
};

/**
 * 是否是微信
 */
export const isWechat = () => {
  return !!navigator.userAgent.match(/MicroMessenger/i);
};

/**
 * 是否是pc
 */
export const isPC = () => {
  return !navigator.userAgent.match(
    /iPhone|Android|SymbianOS|Windows Phone|iPad|iPod/i
  );
};
