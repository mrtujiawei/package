/**
 * 一些可能会用到的常量
 * @filename packages/utils/src/envs/index.ts
 * @author Mr Prince
 * @date 2022-06-19 19:19:48
 */

/**
 * @private
 *
 * 判断是否是浏览器环境
 */
const browser = typeof void 0 != typeof window;

/**
 * @public
 *
 * 判断是否是浏览器环境
 */
export const isBrowser = () => {
  return browser;
};

/**
 * @public
 *
 * 判断是否是 Node.js 环境
 */
export const isNodejs = () => {
  return !isBrowser();
};
