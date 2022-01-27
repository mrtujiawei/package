/**
 * 红黑树实现
 * @filename: src/data-structure/RBTreeNew/Tree.ts
 * @author: Mr Prince
 * @date: 2022-01-27 13:51:45
 */
import { NODE_COLORS, INSERT_MODE } from './enums';
import TreeNode from './TreeNode';

/**
 * 基础迭代器
 */
class BaseIterator<K, V> {
  /**
   * @param _node 迭代起始点
   * @param _container 树实例
   */
  constructor(public node: TreeNode<K, V>, private _container: RBTree<K, V>) {}

  equals(rhs: BaseIterator<K, V>) {
    const lhsClass = this.constructor.name;
    const rhsClass = this.constructor.name;
    if (lhsClass != rhsClass) {
      throw new Error('不同类型的迭代器无法比较');
    }
    if (this._container != rhs._container) {
      throw new Error('不同树的迭代器无法比较');
    }
    return this.node == rhs.node;
  }
  get key() {
    return this.node.key;
  }
  get value() {
    return this.node.value;
  }
  get container() {
    return this._container;
  }
}

/**
 * @example
 * const m = new TreeMap();
 * for (let it = m.begin(); !it.equals(m.end()); it.next()) {
 *   console.log(`key: ${it.key}, value: ${it.value}`);
 * }
 */
class RBTreeIterator<K, V> extends BaseIterator<K, V> {
  constructor(nodeOrIterator: TreeNode<K, V> | RBTreeIterator<K, V>, container?: RBTree<K, V>) {
    if (nodeOrIterator instanceof RBTreeIterator) {
      const className = nodeOrIterator.constructor.name;
      if (className == RBTreeIterator.name) {
        super(nodeOrIterator.node, nodeOrIterator.container);
      } else if (className == RBTreeReverseIterator.name) {
        // 迭代器往后移一位
        // 反向遍历时能够访问到当前节点
        const node = nodeOrIterator.container.next(nodeOrIterator.node);
        super(node, nodeOrIterator.container);
      } else {
        throw new Error(`无法从${className}创建${RBTreeIterator.name}`);
      }
    } else {
      super(nodeOrIterator as TreeNode<K, V>, container as RBTree<K, V>);
    }
  }

  prev () {
    this.node = this.container.prev(this.node);
  }

  next() {
    this.node = this.container.next(this.node);
  }
}

class RBTreeReverseIterator<K, V> extends BaseIterator<K, V> {
  constructor(nodeOrIterator: TreeNode<K, V> | RBTreeReverseIterator<K, V>, container?: RBTree<K, V>) {
    if (nodeOrIterator instanceof RBTreeIterator) {
      const className = nodeOrIterator.constructor.name;
      if (className == RBTreeReverseIterator.name) {
        super(nodeOrIterator.node, nodeOrIterator.container);
        // TODO RBTreeReverseIterator
      } else if (className == RBTreeIterator.name) {
        // 往后遍历一位
        // 保证反向遍历的时候能够遍历到当前节点
        const node = nodeOrIterator.container.prev(nodeOrIterator.node);
        super(node, nodeOrIterator.container);
      } else {
        throw new Error(`无法从${className}创建${RBTreeReverseIterator.name}`);
      }
    } else {
      super(nodeOrIterator as TreeNode<K, V>, container as RBTree<K, V>);
    }
  }
  prev () {
    this.node = this.container.next(this.node);
  }

  next() {
    this.node = this.container.prev(this.node);
  }
}

class InsertResult<K, V> {
  constructor(
    public wasAdded: boolean,
    public wasReplaced: boolean,
    public iterator?: RBTreeIterator<K, V>
  ) {}
}

/**
 * 迭代相关的函数都不写
 */
class RBTree<K, V> {
  /**
   * 根节点
   */
  private root: TreeNode<K, V> | null = null;

  /**
   * 最小节点
   */
  private leftmost: TreeNode<K, V> | null = null;

  /**
   * 最大节点
   */
  private rightmost: TreeNode<K, V> | null = null;

  /**
   * 现有节点数
   */
  private size = 0;

  /**
   * 比较函数
   */
  private compare!: (lhs: K, rhs: K) => number;

  getSize() {
    return this.size;
  }

  getMin() {
    return this.leftmost;
  }

  getMax() {
    return this.rightmost;
  }

  constructor(compare: (lhs: K, rhs: K) => number) {
    this.compare = compare;
  }

  /**
   * 节点比较
   */
  private compareNodes(lhs: TreeNode<K, V>, rhs: TreeNode<K, V>) {
    return this.compare(lhs.key, rhs.key);
  }

  /**
   * 判断是否是叶节点
   */
  private isLeaf(node: TreeNode<K, V>) {
    return null == node;
  }

  /**
   * 判断是否是根节点
   */
  private isRoot(node: TreeNode<K, V>) {
    return node == this.root;
  }

  /**
   * 判断是否有父节点
   * 不是根节点且不是叶节点(null)
   */
  private hasParent(node: TreeNode<K, V>) {
    return !this.isRoot(node) && !this.isLeaf(node);
  }

  /**
   * 节点替换
   */
  private replaceNode(oldNode: TreeNode<K, V>, newNode: TreeNode<K, V>) {
    if (oldNode == newNode) {
      return;
    }

    // 没有父节点，说明是根节点
    if (null == oldNode.parent) {
      this.root = newNode;
    } else {
      // 如果是左节点
      if (oldNode == oldNode.parent.left) {
        oldNode.parent.left = newNode;
      } else {
        oldNode.parent.right = newNode;
      }
    }

    // 不是页节点和根节点
    // 说明老的节点会有父节点
    if (this.hasParent(newNode)) {
      newNode.parent = oldNode.parent;
    }
  }

  /**
   *     X                Y
   *    / \              / \
   *   Y   c  右旋 -->  a   X
   *  / \     <--  左旋    / \
   * a   b                b   c
   */
  private rotateLeft(node: TreeNode<K, V>) {
    // 上图 X 节点
    const right = node.right;
    if (this.isLeaf(right)) {
      throw new Error('无法左旋,树已损坏');
    }
    // node -> Y
    // right -> X
    this.replaceNode(node, right);
    node.right = right.left;

    // 如果b不是空节点
    // 需要修改b的父节点
    if (null != right.left) {
      right.left.parent = node;
    }

    right.left = node;
    node.parent = right;
  }

  /**
   *     X                Y
   *    / \              / \
   *   Y   c  右旋 -->  a   X
   *  / \     <--  左旋    / \
   * a   b                b   c
   */
  private rotateRight(node: TreeNode<K, V>) {
    const left = node.left;
    if (this.isLeaf(left)) {
      throw new Error('无法右旋，树已损坏');
    }
    // node -> X
    // left -> Y
    this.replaceNode(node, left);

    // 移动 b
    node.left = left.right;
    if (null != left.right) {
      // 修改 b 的 parent
      left.right.parent = node;
    }
    left.right = node;
    node.parent = left;
  }

  /**
   * 获取节点颜色
   */
  private fetchColor(node: TreeNode<K, V>) {
    if (this.isLeaf(node)) {
      return NODE_COLORS.BLACK;
    }
    return node.color;
  }

  private isBlack(node: TreeNode<K, V>) {
    return NODE_COLORS.BLACK == this.fetchColor(node);
  }

  private isRed(node: TreeNode<K, V>) {
    return NODE_COLORS.RED == this.fetchColor(node);
  }

  /**
   * ====================
   *      插入节点
   * ===================
   */
  /**
   * 可以插入相同key的节点
   */
  insertMulti(key: K, value: V) {
    return this.insertNode(key, value, INSERT_MODE.MULTI);
  }

  /**
   * 当插入相同的key时，忽略本次插入操作
   */
  insertUnique(key: K, value: V) {
    return this.insertNode(key, value, INSERT_MODE.IGNORE);
  }

  /**
   * 当插入相同的key时
   * 执行替换操作，否则执行插入操作
   */
  insertOrReplace(key: K, value: V) {
    return this.insertNode(key, value, INSERT_MODE.REPLACE);
  }

  /**
   * 插入节点
   */
  private insertNode(key: K, value: V, mode = INSERT_MODE.MULTI) {
    const node = new TreeNode<K, V>();
    node.key = key;
    node.value = value;

    const result = this.insertNodeInternal(
      this.root as TreeNode<K, V>,
      node,
      mode
    );
    if (result) {
    }
  }

  /**
   * 根据模式实现插入节点操作
   * 看二叉搜索树的插入操作
   */
  private insertNodeInternal(
    root: TreeNode<K, V>,
    node: TreeNode<K, V>,
    mode: INSERT_MODE
  ) {
    /**
     * 暂存父级节点
     * 当 child 为 null 时，就说明可以插入了
     */
    let parent = root;
    let child = null;
    while (!this.isLeaf(parent)) {
      child = parent;
      const compare = this.compareNodes(child, node);
      if (0 < compare) {
        parent = parent.left;
      } else if (0 > compare) {
        parent = parent.right;
      } else {
        // 找到相同节点
        switch (mode) {
          case INSERT_MODE.MULTI:
            // TODO
            break;
          case INSERT_MODE.IGNORE:
            return new InsertResult<K, V>(false, false);
          case INSERT_MODE.REPLACE:
            return false;
        }
      }
    }

    // 没有找到相同节点并且没有子节点

    return true;
  }

  private insertRepairTree() {}

  /**
   * 清空树
   */
  clear() {
    this.leftmost = null;
    this.rightmost = null;
    this.root = null;
    this.size = 0;
  }

  /**
   * TODO 和原来的差很大，需要做很多处理
   * 下次注意
   * ===================
   *    迭代器相关
   * ===================
   */
  prev(node: TreeNode<K, V>) {
    // TODO 和原来的不一样，后期可能要改
    while (node.parent.right != node) {
      node = node.parent;
    }
    return node.parent;
  }

  /**
   * 下一个节点
   */
  next(node: TreeNode<K, V>) {
    // TODO 把所有的 if 都移除了
    while (null != node.parent.left) {
      node = node.parent;
    }
    return node.parent;
  }
}

export default RBTree;
