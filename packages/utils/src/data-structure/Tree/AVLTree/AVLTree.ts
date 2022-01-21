/**
 * 平衡二叉搜索树
 * AVL 树得名于它的发明者 G. M. Adelson-Velsky 和 Evgenii Landis
 * @filename: Tree/AVLTree/AVLTree.ts
 * @author: Mr Prince
 * @date: 2022-06-27 20:40:29
 */
// TODO 如果插入相同的key, 将原来的value值改为新的value
import TreeNode from './TreeNode';
import type { Compare } from '../../../types';

class AVLTree<K, V> {
  /**
   * 根节点
   */
  private root: TreeNode<K, V> | null = null;

  /**
   * 节点数
   */
  private count = 0;

  /**
   * 比较器类型错误
   */
  static readonly CompareInvalidError = class extends Error {
    constructor(message: string = 'Param Compare is not a function.') {
      super(message);
    }
  };

  /**
   * 重复value
   */
  static readonly DuplicateValueError = class extends Error {
    constructor(message: string = 'Value is exist.') {
      super(message);
    }
  };

  constructor(private compare: Compare<K>, list: [K, V][] = []) {
    if (!compare) {
      throw new AVLTree.CompareInvalidError();
    }
    list.forEach(([key, value]) => {
      this.append(key, value);
    });
  }

  /**
   * 平衡节点
   */
  private balanceNode(node: TreeNode<K, V> | null) {
    if (null == node) {
      return;
    }

    node.updateHeight();
    const balance = node.getBalance();
    if (1 < balance) {
      if (node.getLeft()!.hasLeft()) {
        node.rotateRight();
      } else if (node.getLeft()!.hasRight()) {
        node.rotateLeftRight();
      }
    } else if (-1 > balance) {
      if (node.getRight()!.hasRight()) {
        node.rotateLeft();
      } else if (node.getRight()!.hasLeft()) {
        node.rotateRightLeft();
      }
    }

    if ((-1 > balance || 1 < balance) && node == this.root) {
      this.root = node.getParent();
    }
  }

  /**
   * 添加节点
   */
  append(key: K, value: V) {
    const newNode = new TreeNode<K, V>(key, value);

    if (null == this.root) {
      this.root = newNode;
      this.count = 1;
    } else {
      this.appendNode(this.root, newNode);
      this.count++;
    }
  }

  /**
   * 添加节点实现
   */
  private appendNode(parentNode: TreeNode<K, V>, childNode: TreeNode<K, V>) {
    const cmp = this.compare(parentNode.getKey(), childNode.getKey());
    if (0 == cmp) {
      // 不能出现重复值
      throw new AVLTree.DuplicateValueError();
    }
    if (0 < cmp) {
      if (parentNode.hasLeft()) {
        this.appendNode(parentNode.getLeft()!, childNode);
        this.balanceNode(parentNode);
      } else {
        parentNode.setLeft(childNode);
        childNode.setParent(parentNode);
        parentNode.updateHeight();
      }
    } else if (0 > cmp) {
      if (parentNode.hasRight()) {
        this.appendNode(parentNode.getRight()!, childNode);
        this.balanceNode(parentNode);
      } else {
        childNode.setParent(parentNode);
        parentNode.setRight(childNode);
        parentNode.updateHeight();
      }
    }
  }

  /**
   * 根据 key 移除节点
   */
  remove(key: K) {
    const removeResult = this.removeNode(this.root, key);
    if (removeResult) {
      this.count--;
    }

    return removeResult;
  }

  /**
   * 移除key相同的节点
   */
  private removeNode(node: TreeNode<K, V> | null, key: K): boolean {
    if (null == node) {
      return false;
    }
    const cmp = this.compare(node.getKey(), key);

    if (0 > cmp) {
      const removed = this.removeNode(node.getRight(), key);
      this.balanceNode(node);
      return removed;
    }

    if (0 < cmp) {
      const removed = this.removeNode(node.getLeft(), key);
      this.balanceNode(node);
      return removed;
    }

    // 要移除的就是当前节点
    if (node.isLeaf()) {
      if (node.isRoot()) {
        this.root = null;
      } else if (node.isLeftChild()) {
        node.getParent()!.setLeft(null);
        node.getParent()!.updateHeight();
      } else {
        node.getParent()!.setRight(null);
        node.getParent()!.updateHeight();
      }
      return true;
    }

    // 右节点不存在
    if (!node.hasRight()) {
      if (node.isRoot()) {
        this.root = node.getLeft();
      } else if (node.isLeftChild()) {
        const parent = node.getParent()!;
        parent.setLeft(node.getLeft());
        parent.updateHeight();
      } else {
        const parent = node.getParent()!;
        parent.setRight(node.getLeft());
        parent.updateHeight();
      }
      node.getLeft()!.setParent(node.getParent()!);
      return true;
    }

    // 左节点不存在
    if (!node.hasLeft()) {
      if (node.isRoot()) {
        this.root = node.getRight();
      } else if (node.isLeftChild()) {
        const parent = node.getParent()!;
        parent.setLeft(node.getRight());
        parent.updateHeight();
      } else {
        const parent = node.getParent();
        parent!.setRight(node.getRight());
        parent!.updateHeight();
      }
      node.getRight()!.setParent(node.getParent()!);
      return true;
    }

    // 左右节点都存在
    // 1. 获取右子树的最小节点
    // 2. 将当前节点的 key value 更改为 右子节点的 key value
    // 3. 删除右子节点
    const minRight = this.getMinNode(node.getRight()!);
    node.setKey(minRight.getKey());
    node.setValue(minRight.getValue());
    return this.removeNode(minRight, minRight.getKey());
  }

  /**
   * 需要确保 node 不为 null
   */
  private getMinNode(node: TreeNode<K, V>): TreeNode<K, V> {
    if (node.hasLeft()) {
      return this.getMinNode(node.getLeft()!);
    }
    return node;
  }

  has(key: K) {
    if (!this.root) {
      return false;
    }
    return this.hasKey(key, this.root);
  }

  private hasKey(key: K, parentNode: TreeNode<K, V>): boolean {
    const cmp = this.compare(parentNode.getKey(), key);
    if (0 < cmp) {
      return parentNode.hasLeft() && this.hasKey(key, parentNode.getLeft()!);
    } else if (0 > cmp) {
      return parentNode.hasRight() && this.hasKey(key, parentNode.getRight()!);
    }
    return true;
  }

  getValue(key: K): V | undefined {
    if (!this.root) {
      return;
    }
    return this.getValueByKey(key, this.root);
  }

  private getValueByKey(key: K, parentNode: TreeNode<K, V>): V | undefined {
    const cmp = this.compare(parentNode.getKey(), key);
    if (0 < cmp) {
      return parentNode.hasLeft()
        ? this.getValueByKey(key, parentNode.getLeft()!)
        : void 0;
    } else if (0 > cmp) {
      return parentNode.hasRight()
        ? this.getValueByKey(key, parentNode.getRight()!)
        : void 0;
    }
    return parentNode.getValue();
  }

  /**
   * 节点个数
   */
  getSize() {
    return this.count;
  }

  /**
   * 清空树
   */
  clear() {
    this.root = null;
    this.count = 0;
  }

  forEach(callback: (value: V, key: K, context: AVLTree<K, V>) => void) {
    for (const [key, value] of this) {
      callback(value, key, this);
    }
  }

  toArray() {
    const arr: [K, V][] = [];
    this.forEach((value, key) => {
      arr.push([key, value]);
    });
    return arr;
  }

  [Symbol.iterator]() {
    let currentNode = this.root;
    if (currentNode) {
      this.getMinNode(currentNode);
    }

    const next = () => {
      let done = true;
      let value!: [K, V];

      if (currentNode) {
        done = false;
        value = [currentNode.getKey(), currentNode.getValue()];
        if (currentNode.hasRight()) {
          currentNode = this.getMinNode(currentNode?.getRight()!);
        } else if (currentNode.hasParent()){
          if (currentNode.isLeftChild()) {
            currentNode = currentNode.getParent();
          } else {
            while (currentNode && currentNode.isRightChild()) {
              currentNode = currentNode.getParent();
            }
            if (currentNode) {
              currentNode = currentNode.getParent();
            }
          }
        }
      }

      return {
        value,
        done,
      };
    }

    return {
      next,
    };
  }
}

export default AVLTree;
