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

export default TreeNode;
