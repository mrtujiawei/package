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
  MULTI,

  /**
   * 忽略相同值的节点
   */
  IGNORE,

  /**
   * key相同替换
   */
  REPLACE,
};
