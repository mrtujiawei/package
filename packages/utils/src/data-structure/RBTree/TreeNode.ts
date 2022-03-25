/**
 * 红黑树节点
 * @filename: src/data-structure/RBTree/TreeNode.ts
 * @author: Mr Prince
 * @date: 2022-02-07 14:58:50
 */
import { NODE_COLORS } from './enums';

class TreeNode<K, V> {
  // @ts-ignore
  key!: K = null;
  // @ts-ignore
  value!: V = null;

  /**
   * 默认红色，介绍对规则的破坏
   */
  color = NODE_COLORS.RED;
  // @ts-ignore
  left!: TreeNode<K, V> = null;
  // @ts-ignore
  right!: TreeNode<K, V> = null;
  // @ts-ignore
  parent!: TreeNode<K, V> = null;

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
