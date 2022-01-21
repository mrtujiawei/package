/**
 * 二叉搜索树
 * @filename: Tree/BinarySearchTree/BinarySearchTree.ts
 * @author: Mr Prince
 * @date: 2022-06-28 11:14:06
 */

// TODO 如果插入相同的key, 将原来的value值改为新的value
import { Compare } from '../../../types';
import TreeNode from './TreeNode';

class BinarySearchTree<K, V> {
  /**
   * 根节点
   */
  private root: TreeNode<K, V> | null = null;

  /**
   * 节点个数
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

  /**
   * @param compare 比较器, 比较节点大小
   * @param list 初始节点
   */
  constructor(private compare: Compare<K>, list: [K, V][] = []) {
    if (!compare) {
      throw new BinarySearchTree.CompareInvalidError();
    }
    list.forEach(([key, value]) => {
      this.append(key, value);
    });
  }

  /**
   * 添加到二叉搜索树中
   */
  append(key: K, value: V): void {
    const node = new TreeNode<K, V>(key, value);
    if (null == this.root) {
      this.root = node;
      this.count = 1;
    } else {
      this.appendNode(this.root, node);
      this.count++;
    }
  }

  /**
   * 添加节点
   */
  private appendNode(parentNode: TreeNode<K, V>, childNode: TreeNode<K, V>) {
    let compare = this.compare(parentNode.getKey(), childNode.getKey());
    if (0 == compare) {
      // 二叉搜索树不能出现重复元素
      throw new BinarySearchTree.DuplicateValueError();
    }

    if (0 > compare) {
      if (parentNode.hasRight()) {
        this.appendNode(parentNode.getRight()!, childNode);
      } else {
        childNode.setParent(parentNode);
        parentNode.setRight(childNode);
      }
    } else if (0 < compare) {
      if (parentNode.hasLeft()) {
        this.appendNode(parentNode.getLeft()!, childNode);
      } else {
        childNode.setParent(parentNode);
        parentNode.setLeft(childNode);
      }
    }
  }

  /**
   * 删除节点
   * 如果要删除的是根节点
   */
  remove(key: K): boolean {
    if (this.isEmpty()) {
      return false;
    }

    const removeResult = this.removeNode(this.root, key);
    if (removeResult) {
      this.count--;
    }

    return removeResult;
  }

  /**
   * 移除节点
   */
  private removeNode(node: TreeNode<K, V> | null, key: K): boolean {
    if (!node) {
      return false;
    }

    const cmp = this.compare(node.getKey(), key);
    if (0 > cmp) {
      return this.removeNode(node.getRight(), key);
    }

    if (0 < cmp) {
      return this.removeNode(node.getLeft(), key);
    }

    // 删除当前节点后的根节点
    let currentRoot: TreeNode<K, V> | null = null;

    if (node.hasLeft() && node.hasRight()) {
      // 左右节点都存在
      currentRoot = node.getRight();
      this.appendNode(currentRoot!, node.getLeft()!);
    } else if (!node.hasLeft()) {
      // 要删除的节点没有左子节点
      currentRoot = node.getRight();
    } else if (!node.hasRight()) {
      // 要删除的节点没有右子节点
      currentRoot = node.getLeft();
    } else {
      // 要删除的节点是叶节点
      // 不需要做任何操作
    }

    if (node.isLeftChild()) {
      node.getParent()!.setLeft(currentRoot);
    } else if (node.isRightChild()) {
      node.getParent()!.setRight(currentRoot);
    } else {
      this.root = currentRoot;
    }

    if (null != currentRoot) {
      currentRoot.setParent(node.getParent());
    }

    return true;
  }

  /**
   * 获取最小值
   */
  getMin(): V | undefined {
    let root = this.root;
    if (!root) {
      return;
    }
    while (root) {
      let left = root.getLeft();
      if (!left) {
        break;
      }
      root = left;
    }

    return root.getValue();
  }

  /**
   * 节点个数
   */
  getSize() {
    return this.count;
  }

  getMax(): V | undefined {
    let root = this.root;
    if (!root) {
      return;
    }
    while (root) {
      let right = root.getRight();
      if (!right) {
        break;
      }
      root = right;
    }

    return root.getValue();
  }

  has(key: K) {
    return this.hasValue(this.root, key);
  }

  private hasValue(node: TreeNode<K, V> | null, key: K): boolean {
    if (!node) {
      return false;
    }
    const cmp = this.compare(node.getKey(), key);
    if (0 == cmp) {
      return true;
    }
    if (0 < cmp) {
      return this.hasValue(node.getLeft(), key);
    }
    return this.hasValue(node.getRight(), key);
  }

  find(key: K): V | undefined {
    return this.findValue(this.root, key);
  }

  private findValue(node: TreeNode<K, V> | null, key: K): V | undefined {
    if (!node) {
      return;
    }
    const cmp = this.compare(node.getKey(), key);
    if (0 == cmp) {
      return node.getValue();
    }
    if (0 < cmp) {
      return this.findValue(node.getLeft(), key);
    }
    return this.findValue(node.getRight(), key);
  }

  clear(): void {
    this.root = null;
  }

  /**
   * 是否为空
   */
  isEmpty() {
    return 0 == this.count;
  }

  /**
   * 是否非空
   */
  isNotEmpty() {
    return !this.isEmpty();
  }

  inorderTraversal(callback: (value: V, key: K) => void): void {
    this.inorderTraversalImpl(this.root, callback);
  }

  private inorderTraversalImpl(
    node: TreeNode<K, V> | null,
    callback: (value: V, key: K) => void
  ) {
    if (!node) {
      return;
    }
    this.inorderTraversalImpl(node.getLeft(), callback);
    callback(node.getValue(), node.getKey());
    this.inorderTraversalImpl(node.getRight(), callback);
  }

  preorderTraversal(callback: (value: V, key: K) => void) {
    this.preorderTraversalImpl(this.root, callback);
  }

  private preorderTraversalImpl(node: TreeNode<K, V> | null, callback: (value: V, key: K) => void) {
    if (!node) {
      return;
    }
    callback(node.getValue(), node.getKey());
    this.inorderTraversalImpl(node.getLeft(), callback);
    this.inorderTraversalImpl(node.getRight(), callback);
  }

  postorderTraversal(callback: (value: V, key: K) => void) {
    this.postorderTraversalImpl(this.root, callback);
  }

  private postorderTraversalImpl(node: TreeNode<K, V> | null, callback: (value: V, key: K) => void) {
    if (!node) {
      return;
    }
    this.inorderTraversalImpl(node.getLeft(), callback);
    this.inorderTraversalImpl(node.getRight(), callback);
    callback(node.getValue(), node.getKey());
  }

  /**
   * 小于或等于指定值的最大值
   * @param includeEqual 是否包含指定值
   */
  lowerBound(key: K, includeEqual = true): V | undefined {
    return this.lowerBoundImpl(this.root, key, includeEqual);
  }

  /**
   * 小于或等于指定值的最大值
   */
  private lowerBoundImpl(node: TreeNode<K, V> | null, key: K, includeEqual: boolean): V | undefined {
    if (!node) {
      return;
    }
    const cmp = this.compare(node.getKey(), key);

    if (0 < cmp) {
      // 大于 key
      return this.lowerBoundImpl(node.getLeft(), key, includeEqual);
    }

    // 相等，并且包含相等
    if (0 == cmp) {
      if (includeEqual) {
        return node.getValue();
      }
      return this.lowerBoundImpl(node.getLeft(), key, includeEqual);
    }

    // 小于 key ,但不一定是最大的
    if (0 > cmp) {
      return this.lowerBoundImpl(node.getRight(), key, includeEqual) || node.getValue();
    }
  }

  /**
   * 大于或等于指定值的最小值
   * @param includeEqual 是否包含指定值
   */
  upperBound(key: K, includeEqual = true): V | undefined {
    return this.upperBoundImpl(this.root, key, includeEqual);
  }

  /**
   * 大于或等于指定值的最小值
   * @param includeEqual 是否包含指定值
   */
  upperBoundImpl(node: TreeNode<K, V> | null, key: K, includeEqual = true): V | undefined {
    if (!node) {
      return;
    }
    const cmp = this.compare(node.getKey(), key);

    // 当前key 小于 目标key
    if (0 > cmp) {
      return this.upperBoundImpl(node.getRight(), key, includeEqual);
    }

    // 相等
    if (0 == cmp) {
      if (includeEqual) {
        return node.getValue();
      }

      // 必须大于
      return this.upperBoundImpl(node.getRight(), key, includeEqual);
    }

    // 小于
    if (0 < cmp) {
      return this.upperBoundImpl(node.getLeft(), key, includeEqual) || node.getValue();
    }
  }

  /**
   * 小于等于 key 的
   */
  floor(key: K) {
    return this.lowerBound(key, true);
  }

  /**
   * 大于等于 key 的
   */
  ceil(key: K) {
    return this.upperBound(key, true);
  }

  toArray(): [K, V][] {
    let result: [K, V][] = [];

    this.inorderTraversal((value, key) => {
      result.push([key, value]);
    });

    return result;
  }
}

export default BinarySearchTree;
