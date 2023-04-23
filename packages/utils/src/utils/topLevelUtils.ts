/**
 * 顶层工具
 * 为了解决循环依赖而引入这个文件
 *
 * 文件之间循环依赖
 * 且引入其他文件的函数后就要立即使用的函数
 * 建议放到这里,否则可能会报错
 *
 * @filename: src/utils/topLevelUtils.ts
 * @author: Mr Prince
 * @date: 2022-06-18 20:01:32
 */

/**
 * 返回 [Object, {type}]
 *
 * @public
 */
export const toString = (() => {
  const _toString = Object.prototype.toString;
  return (obj: unknown): string => _toString.call(obj);
})();
