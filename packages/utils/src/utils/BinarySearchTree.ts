/**
 * 二叉搜索树
 * @filename: BinarySearchTree.ts
 * @author: Mr Prince
 * @date: 2021-09-22 15:54:48
 */
type Compare<T> = (a: T, b: T) => number;

class TreeNode<T> {
  private value!: T;
  private left!: TreeNode<T>;
  private right!: TreeNode<T>;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }

  getLeft(): TreeNode<T> {
    return this.left;
  }

  setLeft(left: TreeNode<T>): void {
    this.left = left;
  }

  getRight(): TreeNode<T> {
    return this.right;
  }

  setRight(right: TreeNode<T>): void {
    this.right = right;
  }
}

class BinarySearchTree<T> {
  private root!: TreeNode<T>;
  private compare!: Compare<T>;

  static readonly CompareInvalidError = class extends Error {
    constructor(message: string = 'Param Compare is not a function.') {
      super(message);
    }
  };

  static readonly DuplicateValueError = class extends Error {
    constructor(message: string = 'Value is exist.') {
      super(message);
    }
  };

  constructor(compare: Compare<T>, list: T[] = []) {
    if (!compare) {
      throw new BinarySearchTree.CompareInvalidError();
    }
    this.compare = compare;
    list.forEach((value) => {
      this.append(value);
    });
  }

  append(value: T): void {
    let node = new TreeNode<T>(value);
    this.root = this.appendNode(this.root, node);
  }

  private appendNode(
    parentNode: TreeNode<T>,
    childNode: TreeNode<T>
  ): TreeNode<T> {
    // 父节点不存在这种情况只存在 append 调用的时候
    if (!parentNode) {
      return childNode;
    }

    let compare = this.compare(parentNode.getValue(), childNode.getValue());
    if (0 == compare) {
      // 二叉搜索树不能出现重复元素
      throw new BinarySearchTree.DuplicateValueError();
    }

    if (0 > compare) {
      let right = parentNode.getRight();
      parentNode.setRight(this.appendNode(right, childNode));
    } else if (0 < compare) {
      let left = parentNode.getLeft();
      parentNode.setLeft(this.appendNode(left, childNode));
    }
    return parentNode;
  }

  remove(value: T): void {
    this.root = this.removeNode(this.root, value);
  }

  private removeNode(parentNode: TreeNode<T>, removeValue: T): TreeNode<T> {
    if (!parentNode) {
      // @ts-ignore
      return null;
    }

    let compare = this.compare(parentNode.getValue(), removeValue);

    if (0 == compare) {
      // appendNode 需要右节点存在
      if (!parentNode.getRight()) {
        return parentNode.getLeft();
      }

      // 已经找到，开始处理要删除节点的子节点
      return this.appendNode(parentNode.getLeft(), parentNode.getRight());
    }
    if (0 > compare) {
      let right = parentNode.getRight();
      parentNode.setRight(this.removeNode(right, removeValue));
    } else if (0 < compare) {
      let left = parentNode.getLeft();
      parentNode.setLeft(this.removeNode(left, removeValue));
    }
    return parentNode;
  }

  getMin(): T {
    let root = this.root;
    if (!root) {
      // @ts-ignore
      return null;
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

  getMax(): T {
    let root = this.root;
    if (!root) {
      // @ts-ignore
      return null;
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

  clear(): void {
    // @ts-ignore
    this.root = null;
  }

  inorderTraversal(callback: (value: T) => void): void {
    const traversal = (root: TreeNode<T>) => {
      if (!root) {
        return;
      }
      traversal(root.getLeft());
      callback(root.getValue());
      traversal(root.getRight());
    };
    traversal(this.root);
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
