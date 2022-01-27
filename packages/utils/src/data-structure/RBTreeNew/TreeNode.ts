/**
 * 红黑树节点
 * @filename: src/data-structure/RBTree/TreeNode.ts
 * @author: Mr Prince
 * @date: 2022-01-24 14:58:50
 */
import { NODE_COLORS } from './enums';

class TreeNode<K, V> {
  key!: K;
  value!: V;

  /**
   * 默认红色，介绍对规则的破坏
   */
  color = NODE_COLORS.RED;
  left!: TreeNode<K, V>;
  right!: TreeNode<K, V>;
  parent!: TreeNode<K, V>;

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
      return parent;
    }
    return parent.getSiblingNode();
  }
}

export default TreeNode;
