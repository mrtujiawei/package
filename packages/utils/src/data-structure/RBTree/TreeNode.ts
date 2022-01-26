/**
 * 红黑树节点
 * @filename: src/data-structure/RBTree/TreeNode.ts
 * @author: Mr Prince
 * @date: 2022-01-24 14:58:50
 */

export enum NODE_COLORS {
  BLACK = 0,
  RED = 1,
}

class TreeNode {
  static readonly NODE_COLORS = NODE_COLORS;

  left: TreeNode | null = null;
  right: TreeNode | null = null;
  parent: TreeNode | null = null;
  color: NODE_COLORS = NODE_COLORS.RED;

  key: any = null;
  value: any = null;

  /**
   * 祖父节点
   */
  getGrandparentNode() {
    const parent = this.parent;
    if (null == parent) {
      return parent;
    }
    return parent.parent;
  }

  /**
   * 兄弟节点
   */
  getSiblingNode() {
    const parent = this.parent;
    if (null == parent) {
      return parent;
    }
    if (this == parent.left) {
      return parent.right;
    } else {
      return parent.left;
    }
  }

  /**
   * 父节点的兄弟节点
   */
  getUncleNode() {
    const parent = this.parent;
    if (null == parent) {
      return null;
    }
    return parent.getSiblingNode();
  }
}

export default TreeNode;
