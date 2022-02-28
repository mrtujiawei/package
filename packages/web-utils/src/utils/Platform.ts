/**
 * 平台判断，主要是根据 userAgent
 * @filename: packages/web-utils/src/Platform.ts
 * @author: Mr Prince
 * @date: 2022-02-28 13:52:57
 */

class Platform {
  /**
   * 是否是安卓
   */
  static isAndroid() {
    return !!navigator.userAgent.match(/Android/i);
  }

  /**
   * 是否是黑莓
   */
  static isBlackBerry() {
    return !!navigator.userAgent.match(/BlackBerry/i);
  }

  /**
   * 是否是ios
   */
  static isIOS() {
    return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }

  /**
   * 是否是windows
   */
  static isWindows() {
    return !!navigator.userAgent.match(/IEMobile/i);
  }

  /**
   * 是否是微信
   */
  static isWechat() {
    return !!navigator.userAgent.match(/MicroMessenger/i);
  }

  /**
   * 是否是pc
   */
  static isPC() {
    return !navigator.userAgent.match(
      /iPhone|Android|SymbianOS|Windows Phone|iPad|iPod/i
    );
  }
}

export default Platform;
