/**
 * 二叉搜索树
 * @filename: Tree/BinarySearchTree/BinarySearchTree.ts
 * @author: Mr Prince
 * @date: 2022-06-28 11:14:06
 */
import { Compare } from '../../../types';
import TreeNode from './TreeNode';

class BinarySearchTree<T> {
  /**
   * 根节点
   */
  private root: TreeNode<T> | null = null;

  /**
   * 比较函数
   */
  private compare: Compare<T>;

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
   */
  constructor(compare: Compare<T>, list: T[] = []) {
    if (!compare) {
      throw new BinarySearchTree.CompareInvalidError();
    }
    this.compare = compare;
    list.forEach((value) => {
      this.append(value);
    });
  }

  /**
   * 添加到二叉搜索树中
   */
  append(value: T): void {
    const node = new TreeNode<T>(value);
    if (null == this.root) {
      this.root = new TreeNode<T>(value);
      this.count = 1;
    } else {
      this.appendNode(this.root, node);
      this.count++;
    }
  }

  /**
   * 添加节点
   */
  private appendNode(parentNode: TreeNode<T>, childNode: TreeNode<T>) {
    let compare = this.compare(parentNode.getValue(), childNode.getValue());
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
  remove(value: T): boolean {
    if (this.isEmpty()) {
      return false;
    }

    const removeResult = this.removeNode(this.root, value);
    if (removeResult) {
      this.count--;
    }

    return removeResult;
  }

  /**
   * 移除节点
   */
  private removeNode(node: TreeNode<T> | null, removeValue: T): boolean {
    if (!node) {
      return false;
    }

    const cmp = this.compare(node.getValue(), removeValue);
    if (0 > cmp) {
      return this.removeNode(node.getRight(), removeValue);
    }

    if (0 < cmp) {
      return this.removeNode(node.getLeft(), removeValue);
    }

    // 删除当前节点后的根节点
    let currentRoot: TreeNode<T> | null = null;

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
  getMin(): T {
    let root = this.root;
    if (!root) {
      return undefined as unknown as T;
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

  getMax(): T {
    let root = this.root;
    if (!root) {
      return undefined as unknown as T;
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

  has(value: T) {
    return this.hasValue(this.root, value);
  }

  private hasValue(node: TreeNode<T> | null, value: T): boolean {
    if (!node) {
      return false;
    }
    const cmp = this.compare(node.getValue(), value);
    if (0 == cmp) {
      return true;
    }
    if (0 < cmp) {
      return this.hasValue(node.getLeft(), value);
    }
    return this.hasValue(node.getRight(), value);
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

  inorderTraversal(callback: (value: T) => void): void {
    this.inorderTraversalImpl(this.root, callback);
  }

  private inorderTraversalImpl(
    node: TreeNode<T> | null,
    callback: (value: T) => void
  ) {
    if (!node) {
      return;
    }
    this.inorderTraversalImpl(node.getLeft(), callback);
    callback(node.getValue());
    this.inorderTraversalImpl(node.getRight(), callback);
  }

  toArray(): T[] {
    let result: T[] = [];

    this.inorderTraversal((value) => {
      result.push(value);
    });

    return result;
  }
}

export default BinarySearchTree;
