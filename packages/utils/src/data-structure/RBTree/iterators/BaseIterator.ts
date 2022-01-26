import TreeNode from '../TreeNode';

/**
 * 类似STL的迭代器
 */
class BaseIterator {
  __n: TreeNode | null = null;
  __c = Function;

  /**
   * @param node 初始节点
   * @param container tree 实例
   */
  constructor(node: TreeNode, container: any) {
    this.__n = node;
    this.__c = container;
  }

  /**
   * 判断两个节点是否相同
   * 节点相同且在同一棵树中
   */
  equals(rhs: BaseIterator) {
    const lhsClass = this.constructor.name;
    const rhsClass = rhs.constructor.name;
    if (lhsClass !== rhsClass) {
      throw new Error(
        `无法比较${lhsClass} ${rhsClass}`
      );
    }
    if (this.__c !== rhs.__c) {
      throw new Error(`不在同一个树中，无法比较`);
    }
    return this.__n === rhs.__n;
  }

  /**
   * 当前节点
   */
  get node() {
    return this.__n;
  }

  /**
   * 当前节点的key值
   */
  get key() {
    return this.__n?.key;
  }

  /**
   * 当前节点的value值
   * @returns value of the current node
   */
  get value() {
    // @ts-ignore
    return this.__n?.value;
  }

  /**
   * @private
   * @returns container that holds current node
   */
  get container() {
    return this.__c;
  }
}

export default BaseIterator;
