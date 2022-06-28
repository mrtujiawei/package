import TreeNode from './TreeNode';

/**
 * 平衡二叉搜索树
 * AVL 树得名于它的发明者 G. M. Adelson-Velsky 和 Evgenii Landis
 * @filename: Tree/AVLTree/AVLTree.ts
 * @author: Mr Prince
 * @date: 2022-06-27 20:40:29
 */
import type { Compare } from '../../../types';

class AVLTree<K, V> {
  /**
   * 根节点
   */
  root: TreeNode<K, V> = null;

  /**
   * 节点数
   */
  count = 0;

  constructor(private compare: Compare<K>) {}

  /**
   * 平衡节点
   */
  private balanceNode(node: TreeNode<K, V>) {
    if (null == node) {
      return;
    }

    node.updateHeight();
    const balance = node.getBalance();
    if (balance > 1) {
      if (node.getLeft().hasLeft()) {
        node.rotateRight();
      } else if (node.getLeft().hasRight()) {
        node.rotateLeftRight();
      }
    } else if (balance < -1) {
      if (node.getRight().hasRight()) {
        node.rotateLeft();
      } else if (node.getRight().hasLeft()) {
        node.rotateRightLeft();
      }
    }

    if ((balance < -1 || balance > 1) && node == this.root) {
      this.root = node.getParent();
    }
  }

  insert(key: K, value: V) {
    const newNode = new TreeNode(key, value);

    if (null == this.root) {
      this.root = newNode;
      this.count = 1;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(parent: TreeNode<K, V>, node: TreeNode<K, V>) {
    const insertRecursive = (current) => {
      if (key < current.getKey()) {
        if (current.hasLeft()) {
          insertRecursive(current.getLeft());
          this._balanceNode(current); // backward-tracking
        } else {
          newNode.setParent(current);
          current.setLeft(newNode).updateHeight();
          this._count += 1;
        }
      } else if (key > current.getKey()) {
        if (current.hasRight()) {
          insertRecursive(current.getRight());
          this._balanceNode(current); // backward-tracking
        } else {
          newNode.setParent(current);
          current.setRight(newNode).updateHeight();
          this._count += 1;
        }
      } else {
        current.setValue(value);
      }
    };
  }
}

export default AVLTree;
