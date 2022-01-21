/**
 * 一些可能会用到的常量
 * @filename packages/utils/src/envs/index.ts
 * @author Mr Prince
 * @date 2022-06-19 19:19:48
 */

/**
 * 判断是否是浏览器环境
 */
const browser = typeof void 0 != typeof window;

/**
 * @public
 */
class Envs {
  /**
   * 是否是浏览器环境
   */
  static isBrowser() {
    return browser;
  }

  /**
   * 是否是node环境
   */
  static isNodejs() {
    return !browser;
  }
}

export default Envs;
