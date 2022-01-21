/**
 * Browser 相关功能
 * @filename: /home/tujiawei/github/package/packages/web-utils/src/Browser/index.ts
 * @author: Mr Prince
 * @date: 2022-06-19 20:14:25
 */
class Browser {
  /**
   * 网络相关信息
   * 目前支持还不是很好
   */
  static getConnection() {
    // @ts-ignore
    return navigator.connection;
  }

  /**
   * 可用的逻辑处理器内核数
   */
  static getHardwareConcurrency() {
    return navigator.hardwareConcurrency;
  }

  /**
   * 首选语言
   * 通常是浏览器ui语言
   */
  static getLanguage(defaultLanguage: string) {
    return navigator.language || defaultLanguage || null;
  }

  /**
   * 用户已知语言的字符串数组
   */
  static getLanguages() {
    return navigator.languages;
  }

  /**
   * 多大同时触摸点数
   */
  static getMaxTouchPoints() {
    return navigator.maxTouchPoints;
  }

  /**
   * 网络状态
   */
  private static get online() {
    return navigator.onLine;
  }

  /**
   * 是否在线
   */
  static isOnLine() {
    return Browser.online;
  }

  /**
   * 是否掉线
   */
  static isOffLine() {
    return !Browser.online;
  }

  /**
   * 页面卸载前发送
   * 不一定会成功
   */
  static sendBeacon(url: string | URL, data?: BodyInit | null) {
    navigator.sendBeacon(url, data);
  }

  /**
   * 浏览器信息
   */
  static getUserAgent() {
    return navigator.userAgent || '';
  }

  /**
   * 判断是否是 ios 手机
   */
  static isIPhone() {
    return /iPhone/i.test(Browser.getUserAgent());
  }

  /**
   * 是否是 ios 平板
   */
  static isIPad() {
    return /iPad/i.test(Browser.getUserAgent());
  }

  /**
   * 是否是 ios pod
   * 这还有浏览器？
   */
  static isIPod() {
    return /iPod/i.test(Browser.getUserAgent());
  }

  /**
   * 是否是苹果系统
   */
  static isIos() {
    return /iPhone|iPad|iPod/i.test(Browser.getUserAgent());
  }

  /**
   * 是否是塞班系统
   */
  static isSymbian() {
    return /Symbian/i.test(Browser.getUserAgent());
  }

  /**
   * 是否是黑莓
   */
  static isBlackBerry() {
    return /BlackBerry/i.test(Browser.getUserAgent());
  }

  /**
   * 是否是安卓系统
   */
  static isAndroid() {
    return /(Android|Linux)/i.test(Browser.getUserAgent());
  }

  /**
   * 是否是windows系统
   */
  static isWindows() {
    return /IEMobile/i.test(Browser.getUserAgent());
  }

  /**
   * 是否在微信浏览器中
   */
  static isWechat() {
    return /MicroMessenger/i.test(Browser.getUserAgent());
  }

  /**
   * 是否在 qq 内置的浏览器中
   */
  static isQQ() {
    return /QQ/i.test(Browser.getUserAgent());
  }

  /**
   * 是否是手机qq浏览器
   */
  static isQQMobile() {
    return /mqqbrowser/i.test(Browser.getUserAgent());
  }

  /**
   * 是否是手机浏览器
   */
  static isMobile() {
    return /AppleWebKit.*Mobile.*/i.test(Browser.getUserAgent());
  }

  /**
   * 是否是 webview
   */
  static isWebview() {
    return (
      !(
        /Chrome\/([\d.]+)/i.test(Browser.getUserAgent()) ||
        /CriOS\/([\d.]+)/i.test(Browser.getUserAgent())
      ) &&
      /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
        Browser.getUserAgent()
      )
    );
  }

  /**
   * 是否是电脑端浏览器
   */
  static isPC() {
    return /(Android|iPhone|Windows Phone|SymbianOS|iPad|iPod)/i.test(
      Browser.getUserAgent()
    );
  }

  /**
   * 是否是IE浏览器
   */
  static isIE() {
    return /Trident/i.test(Browser.getUserAgent());
  }

  /**
   * 是否是 opera
   */
  static isOpera() {
    return /Presto/i.test(Browser.getUserAgent());
  }

  /**
   * 是否 safari 浏览器
   */
  static isSafari() {
    return /Safari/i.test(Browser.getUserAgent());
  }

  /**
   * 内核是否是 webkit
   * Chrome 安卓内置浏览器 opera等
   */
  static isWebkit() {
    return /AppleWebKit/i.test(Browser.getUserAgent());
  }

  /**
   * 是否是火狐浏览器
   */
  static isGecko() {
    return (
      /Gecko/i.test(Browser.getUserAgent()) &&
      !/KHTML/i.test(Browser.getUserAgent())
    );
  }

  /**
   * 是否是 oppo 自带的浏览器
   */
  static isOppo() {
    return /HeyTapBrowser/i.test(Browser.getUserAgent());
  }

  /**
   * 是否 web应该程序，没有头部与底部
   */
  static isWebApp() {
    return Browser.isSafari();
  }
}

export default Browser;
