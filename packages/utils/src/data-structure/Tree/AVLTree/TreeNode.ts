class TreeNode<K, V> {
  /**
   * 初始高度
   */
  private height = 1;

  /**
   * 父节点
   */
  private parent: TreeNode<K, V> | null = null;

  /**
   * 左子节点
   */
  private left: TreeNode<K, V> | null = null;

  /**
   * 右子节点
   */
  private right: TreeNode<K, V> | null = null;

  constructor(private key: K, private value: V) {}

  getKey() {
    return this.key;
  }

  setKey(key: K) {
    this.key = key;
  }

  getValue() {
    return this.value;
  }

  setValue(value: V) {
    this.value = value;
  }

  /**
   * 是否有左子节点
   */
  hasLeft() {
    return null != this.left;
  }

  hasRight() {
    return null != this.right;
  }

  getLeft() {
    return this.left;
  }

  getRight() {
    return this.right;
  }

  setLeft(left: TreeNode<K, V> | null) {
    this.left = left;
  }

  setRight(right: TreeNode<K, V> | null) {
    this.right = right;
  }

  getParent() {
    return this.parent;
  }

  setParent(parent: TreeNode<K, V>) {
    this.parent = parent;
  }

  hasParent() {
    return null !=  this.parent;
  }

  /**
   * 是否是根节点
   */
  isRoot() {
    return !this.hasParent();
  }

  /**
   * 是否是叶节点
   */
  isLeaf() {
    return !this.hasLeft() && !this.hasRight();
  }

  /**
   * 左旋
   */
  rotateLeft() {
    const right = this.getRight();

    // 当前节点改为右节点的左子节点
    if (null != right) {
      if (right.hasLeft()) {
        right.getLeft()!.setParent(this);
      }
      this.setRight(right.getLeft());
      right.setLeft(this);
      right.setParent(this.getParent()!);
    }

    if (this.hasParent() && right !== null) {
      if (this.parent!.getKey() < right.getKey()) {
        this.parent!.setRight(right);
      } else {
        this.parent!.setLeft(right);
      }
    }

    this.parent = right;
    this.updateHeight();
    if (this.hasParent()) {
      this.parent!.updateHeight();
    }
  }

  /**
   * 右旋
   */
  rotateRight() {
    const left = this.getLeft(); // this._left will be re-assigned

    // set the node as a right child of its left child
    if (left !== null) {
      if (left.hasRight()) {
        left.getRight()!.setParent(this);
      }

      // rebase left child to node's left right child.
      this.left = left.getRight();

      left.setRight(this);
      left.setParent(this.getParent()!);
    }

    // rebase parent's child to node's left child
    if (this.hasParent() && left !== null) {
      if (this.getParent()!.getKey() > left.getKey()) {
        this.getParent()!.setLeft(left);
      } else {
        this.getParent()!.setRight(left);
      }
    }

    // rebase parent to node's left child
    this.setParent(left!);

    this.updateHeight();
    if (this.hasParent()) {
      this.getParent()!.updateHeight();
    }

  }

  /**
   * 1. 左子节点左旋
   * 2. 当前节点右旋
   */
  rotateLeftRight() {
    if (this.hasLeft()) {
      this.getLeft()!.rotateLeft();
    }
    this.rotateRight();
  }

  /**
   * 1. 右子节点右旋
   * 2. 当前节点左旋
   */
  rotateRightLeft() {
    if (this.hasRight()) {
      this.getRight()!.rotateRight();
    }
    this.rotateLeft();
  }

  /**
   * 做节点高度
   */
  getLeftHeight() {
    if (this.hasLeft()) {
      return this.getLeft()!.getHeight();
    }
    return 0;
  }

  /**
   * 右节点高度
   */
  getRightHeight() {
    if (this.hasRight()) {
      return this.getRight()!.getHeight();
    }
    return 0;
  }

  /**
   * 获取自身高度
   */
  getHeight() {
    return this.height;
  }

  /**
   * 根据子节点更新自身高度
   */
  updateHeight() {
    this.height = Math.max(
      this.getLeftHeight(),
      this.getRightHeight()
    ) + 1;
  }

  /**
   * 获取高度差
   */
  getBalance() {
    return this.getLeftHeight() - this.getRightHeight();
  }

  isBalanced() {
    const balance = this.getBalance();
    return Math.abs(balance) <= 1;
  }

  isLeftChild() {
    return this.hasParent() && this.getParent()!.getLeft() == this;
  }

  isRightChild() {
    return this.hasParent() && this.getParent()!.getRight() == this;
  }
}

export default TreeNode;
