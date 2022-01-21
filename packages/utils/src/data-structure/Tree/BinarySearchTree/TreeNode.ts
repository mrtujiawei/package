class TreeNode<K, V> {
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

  /**
   * @param key 节点key
   * @param value 节点值
   */
  constructor(private key: K, private value: V) {}

  /**
   * 获取key
   */
  getKey() {
    return this.key;
  }

  /**
   * 更改key
   */
  setKey(key: K) {
    this.key = key;
  }

  /**
   * 获取节点值
   */
  getValue() {
    return this.value;
  }

  /**
   * 更改节点值
   */
  setValue(value: V) {
    this.value = value;
  }

  /**
   * 获取父节点
   */
  getParent() {
    return this.parent;
  }

  /**
   * 更改父节点
   */
  setParent(parent: TreeNode<K, V> | null) {
    this.parent = parent;
  }

  hasParent() {
    return null != this.parent;
  }

  /**
   * 获取左子节点
   */
  getLeft() {
    return this.left;
  }

  /**
   * 更改左子节点
   */
  setLeft(left: TreeNode<K, V> | null) {
    this.left = left;
  }

  /**
   * 是否有左子节点
   */
  hasLeft() {
    return null != this.getLeft();
  }

  /**
   * 获取右子节点
   */
  getRight() {
    return this.right;
  }

  /**
   * 更改右子节点
   */
  setRight(right: TreeNode<K, V> | null) {
    this.right = right;
  }

  /**
   * 是否有右子节点
   */
  hasRight() {
    return null != this.getRight();
  }

  /**
   * 判断是否是叶节点
   */
  isLeaf() {
    return !this.hasLeft() && !this.hasRight()
  }

  /**
   * 是否是父节点的左子节点
   */
  isLeftChild() {
    return this.hasParent() && this.getParent()!.getLeft() == this;
  }

  /**
   * 是否是父节点的右子节点
   */
  isRightChild() {
    return this.hasParent() && this.getParent()!.getRight() == this;
  }
}

export default TreeNode;
