/**
 * 红黑树节点
 * @filename: src/data-structure/RBTree/TreeNode.ts
 * @author: Mr Prince
 * @date: 2022-02-07 14:58:50
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

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
    // @ts-ignore
    this.left = this.right = this.parent = null;
  }

  /**
   * 获取兄弟节点
   */
  getSibling() {
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
   * 获取叔叔节点
   */
  getUncle() {
    const parent = this.parent;
    if (null == parent) {
      return parent;
    }
    return parent.getSibling();
  }

  /**
   * 获取祖父节点
   */
  getGrandparent() {
    const parent = this.parent;
    if (null == parent) {
      return parent;
    }
    return parent.parent;
  }
}

export default TreeNode;
