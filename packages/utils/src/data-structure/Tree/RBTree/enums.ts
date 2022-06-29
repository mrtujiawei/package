/**
 * 红黑树需要用到的一些枚举
 * @filename: packages/utils/src/data-structure/RBTree/enums.ts
 * @author: Mr Prince
 * @date: 2022-02-07 15:06:45
 */

/**
 * 节点颜色
 */
export enum NODE_COLORS {
  BLACK,
  RED,
}

/**
 * 插入模式
 */
export enum INSERT_MODE {
  /**
   * 允许添加相同key的value
   */
  MULTIPLE,

  /**
   * 如果有相同的key存在，会忽略当前节点
   */
  UNIQUE,

  /**
   * key相同则替换之前的节点
   */
  REPLACE,
}
