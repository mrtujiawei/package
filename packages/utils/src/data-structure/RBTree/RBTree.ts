/**
 * 红黑树
 * @filename: src/data-structure/RBTree/index.ts
 * @author: Mr Prince
 * @date: 2022-01-24 14:58:06
 */
import TreeNode, { NODE_COLORS } from './TreeNode';
import { KeyOnlyPolicy, ValueOnlyPolicy } from './policy';
import { Iterator, ReverseIterator, } from './iterators/index';
import { JsIterator, JsReverseIterator, } from './js-iterators/index';
import InsertionResult from './InsertResult';

/**
 * 重复添加的类型
 */
enum INSERT_MODE {
  /**
   * 允许添加相同key的value
   */
  MULTI,

  /**
   * 忽略相同值的节点
   */
  IGNORE,

  /**
   * key相同替换
   */
  REPLACE,
}

/**
 * 性能优化用的特殊节点
 */
class Head {
  /**
   * 最左边的节点
   */
  leftmost = this;

  /**
   * 最右边的节点
   */
  rightmost = this;

  /**
   * 根节点
   */
  root = this;

  /**
   * 节点数
   */
  size = 0;
}

class RBTree {
  head = new Head();
  valuePolicy = new KeyOnlyPolicy();

  compare(a: any, b: any) {
    if (a < b) {
      return -1;
    } else if (a == b) {
      return 0;
    }
    return 1;
  }

  clear() {
    this.head = new Head();
  }

  /**
   * 节点数
   */
  get size() {
    return this.head.size;
  }

  compareNodes(node1: TreeNode, node2: TreeNode) {
    return this.compare(node1.key, node2.key);
  }

  /**
   * 旋转节点时会用到
   */
  private replaceNode(oldNode: TreeNode, newNode: TreeNode) {
    if (oldNode === newNode) {
      return;
    }
    if (null == oldNode.parent) {
      // @ts-ignore
      this.head.root = newNode;
    } else {
      if (oldNode === oldNode.parent.left) {
        oldNode.parent.left = newNode;
      } else {
        oldNode.parent.right = newNode;
      }
    }
  }

  /**
   * 左旋
   *     X                        Y
   *    / \                      / \
   *   Y   c  right rotate -->  a   X
   *  / \     <--  left rotate     / \
   * a   b                       b   c
   */
  rotateLeft(node: TreeNode) {
    const right = node.right as TreeNode;
    if (this.isLeaf(right)) {
      throw new Error('节点错乱，无法左旋');
    }

    this.replaceNode(node, right);

    node.right = right.left;
    if (null !== right.left) {
      right.left.parent = node;
    }

    right.left = node;
    node.parent = right;
  }

  /**
   * 右旋
   */
  rotateRight(node: TreeNode) {
    const left = node.left as TreeNode;
    if (this.isLeaf(left)) {
      throw new Error('节点错乱，无法右旋');
    }
    this.replaceNode(node, left);

    node.left = left.right;
    if (null != left.right) {
      left.right.parent = node;
    }

    left.right = node;
    node.parent = left;
  }

  private getColor(node: TreeNode | null) {
    if (this.isLeaf(node)) {
      return NODE_COLORS.BLACK;
    } else {
      return node?.color;
    }
  }

  isBlack(node: TreeNode | null) {
    return this.getColor(node) === NODE_COLORS.BLACK;
  }

  isRed(node: TreeNode | null) {
    return this.getColor(node) == NODE_COLORS.RED;
  }

  /**
   * null 或者 头结点 为 true
   */
  private isLeaf(node: TreeNode | Head | null) {
    if (null == node || node === this.head) {
      return true;
    }
    return false;
  }

  /**
   * @returns iterator pointing to the node with the lowest key
   */
  begin() {
    return new Iterator(this.head.leftmost, this);
  }

  /**
   * @returns iterator pointing to the node following the node with the highest key
   */
  end() {
    return new Iterator(this.head, this);
  }

  /**
   * @returns a new JsIterator object that contains the values for each element in the order of the keys.
   */
  values() {
    return new JsIterator(this, new ValueOnlyPolicy());
  }

  /**
   * @returns iterator pointing to the node with the highest key
   */
  rbegin() {
    return new ReverseIterator(this.head.rightmost, this);
  }

  /**
   * @returns iterator pointing to the node preceding the node with the lowest key
   */
  rend() {
    return new ReverseIterator(this.head, this);
  }

  /**
   * @returns first element of the container, or undefined if container is empty
   */
  first() {
    if (0 == this.size) {
      return undefined;
    } else {
      const it = this.begin();
      return this.valuePolicy.fetch(it.node as TreeNode);
    }
  }

  /**
   */
  last() {
    if (0 == this.size) {
      return undefined;
    } else {
      let it = this.rbegin();
      return this.valuePolicy.fetch(it.node as TreeNode);
    }
  }

  toString() {
    const parts: string[] = [];
    for (let it = this.begin(); !it.equals(this.end()); it.next()) {
      parts.push(this.valuePolicy.toString(it.node as TreeNode));
    }
    return '{' + parts.join(',') + '}';
  }

  /* ===========================
       INSERT
       =========================== */
  /**
   * 插入节点，允许添加重复节点
   * @param node
   * @returns 节点是否添加成功及迭代器
   */
  insertMulti(node: TreeNode) {
    return this.insertNode(node, INSERT_MODE.MULTI);
  }

  /**
   * 插入节点，如果已存在则忽略
   * @param node
   * @returns
   */
  insertUnique(node: TreeNode) {
    return this.insertNode(node, INSERT_MODE.IGNORE);
  }

  /**
   * 插入节点，如果已存在，则替换原来的节点
   * @param node
   * @returns
   */
  insertOrReplace(node: TreeNode) {
    return this.insertNode(node, INSERT_MODE.REPLACE);
  }

  /**
   * 插入节点，更新头结点 平衡红黑树
   * @returns
   */
  insertNode(n: TreeNode | Head, mode = INSERT_MODE.MULTI) {
    // @ts-ignore
    const res = this.insertNodeInternal(this.head.root, n, mode);
    if (res.wasAdded) {
      if (this.head.size === 0) {
        this.head.root = n as Head;
        this.head.leftmost = n as Head;
        this.head.rightmost = n as Head;

        // @ts-ignore
        n.left = this.head;
        // @ts-ignore
        n.right = this.head;
        // @ts-ignore
      } else if (this.head.leftmost.left === n) {
        // @ts-ignore
        this.head.leftmost = n;
        // @ts-ignore
        n.left = this.head;
        // @ts-ignore
      } else if (this.head.rightmost.right === n) {
        // @ts-ignore
        this.head.rightmost = n;
        // @ts-ignore
        n.right = this.head;
      }
      // @ts-ignore
      this.insertRepairTree(n);
      this.head.size = this.head.size + 1;
    }
    return res;
  }

  /**
   * 根据模式插入节点
   * @param root 树的根节点
   * @param n 需要插入的节点
   * @param mode 插入模式
   * @returns
   */
  private insertNodeInternal(root: Head | TreeNode, n: TreeNode, mode: INSERT_MODE) {
    let x = root;
    let y = null;
    let rc = -1;
    // find matching node
    while (!this.isLeaf(x)) {
      y = x;
      rc = this.compareNodes(n, y as TreeNode);
      if (rc < 0) {
        // @ts-ignore
        x = y.left;
      } else if (rc > 0) {
        // @ts-ignore
        x = y.right;
      } else {
        // node with the same key value
        switch (mode) {
          case INSERT_MODE.IGNORE:
            // @ts-ignore
            return new InsertionResult(false, false, undefined);
          case INSERT_MODE.REPLACE:
            // @ts-ignore
            this.valuePolicy.copy(y, n);
            return new InsertionResult(false, true, new Iterator(y, this));
          default:
            // @ts-ignore
            x = y.right;
        }
      }
    }

    if (this.isLeaf(y as TreeNode)) {
      n.parent = null;
      // @ts-ignore
      n.left = this.head;
      // @ts-ignore
      n.right = this.head;
    } else {
      // @ts-ignore
      n.parent = y;
      if (rc < 0) {
      // @ts-ignore
        y.left = n;
      } else {
      // @ts-ignore
        y.right = n;
      }
    }
    return new InsertionResult(true, false, new Iterator(n, this));
  }

  /**
   * 插入修复
   */
  insertRepairTree(node: TreeNode) {
    if (null == node.parent) {
      this.repairCase1(node);
    } else if (this.isBlack(node.parent)) {
      /* insert_case2(n);
      // do nothing */
    } else if (this.isRed(node.getUncleNode() as TreeNode)) {
      this.repairCase3(node);
    } else {
      this.repairCase4(node);
    }
  }

  /**
   * 修复情况1，直接改颜色
   */
  repairCase1(node: TreeNode) {
    node.color = NODE_COLORS.BLACK;
  }

  /**
   * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Insertion
   * @param n - node
   */
  repairCase3(n: TreeNode) {
    // @ts-ignore
    n.parent.color = NODE_COLORS.BLACK;
    // @ts-ignore
    n.getUncleNode().color = NODE_COLORS.BLACK;
    // @ts-ignore
    n.getGrandparentNode().color = NODE_COLORS.RED;
    this.insertRepairTree(n.getGrandparentNode() as TreeNode);
  }

  /**
   * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Insertion
   * @param {*} n - node
   */
  repairCase4(n: TreeNode) {
    let p = n.parent as TreeNode;
    let g = n.getGrandparentNode() as TreeNode;

    if (g.left !== null && n === g.left.right) {
      this.rotateLeft(p);
      n = n.left as TreeNode;
    } else if (g.right !== null && n === g.right.left) {
      this.rotateRight(p);
      n = n.right as TreeNode;
    }

    p = n.parent as TreeNode;
    g = n.getGrandparentNode() as TreeNode;
    if (n === p.left) {
      this.rotateRight(g);
    } else {
      this.rotateLeft(g);
    }

    p.color = TreeNode.NODE_COLORS.BLACK;
    g.color = TreeNode.NODE_COLORS.RED;
  }

  /**
   * @returns the node with the highest key for the subtree of the specified root node
   * @param {*} node - root node of the subtree to be evaluated
   */
  fetchMaximum(node: TreeNode) {
    while (!this.isLeaf(node.right as TreeNode)) {
      node = node.right as TreeNode;
    }

    return node;
  }

  /**
   * @returns the node with the lowest key for the subtree of the specified root node
   * @param {*} node - root node of the subtree to be evaluated
   */
  fetchMinimum(node: TreeNode) {
    while (!this.isLeaf(node.left as TreeNode)) {
      node = node.left as TreeNode;
    }

    return node;
  }

  /**
   * 从树种移除节点
   */
  erase(node: TreeNode) {
    if (this.isLeaf(node)) {
      return;
    }

    this.eraseInternal(node);
    let h = this.head;
    h.size = h.size - 1;
  }

  eraseInternal(node: TreeNode) {
    if (!this.isLeaf(node.left as TreeNode) && !this.isLeaf(node.right as TreeNode)) {
      let pred = this.fetchMaximum(node.left as TreeNode);

      this.valuePolicy.copy(node, pred);
      node = pred;
    }

    let child = this.isLeaf(node.right as TreeNode) ? node.left : node.right;

    if (this.isBlack(node)) {
      this.eraseCase1(node);
    }
    this.replaceNode(node, child as TreeNode);
    if (this.head.size === 2) {
      if (!this.isLeaf(child as TreeNode)) {
        // Root node must be BLACK
        (child as TreeNode).color = TreeNode.NODE_COLORS.BLACK;
      }
    }

    let h = this.head;
    if (this.isLeaf(child as TreeNode)) {
      // 没有子节点，已被删除，需要跟新最左最右的节点
      // @ts-ignore
      if (h.leftmost as TreeNode === node) {
        let p = node.parent;
        if (p !== null) {
          // @ts-ignore
          h.leftmost = p;
          // @ts-ignore
          p.left = h;
        } else {
          h.leftmost = h;
        }
      }
      // @ts-ignore
      if (h.rightmost === node) {
      // @ts-ignore
        let p = node.parent;
        if (p !== null) {
          h.rightmost = p;
          p.right = h;
        } else {
          h.rightmost = h;
        }
      }
    } else {
      // 只有一个节点，需要该节点替换被删除的节点
      // @ts-ignore
      if (h.leftmost === node) {
      // @ts-ignore
        h.leftmost = child;
      // @ts-ignore
        child.left = h;
      }
      // @ts-ignore
      if (h.rightmost === node) {
      // @ts-ignore
        h.rightmost = child;
      // @ts-ignore
        child.right = h;
      }
    }
  }

  /**
   * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param node
   */
  eraseCase1(node: TreeNode) {
    if (node.parent === null) {
      return;
    }
    this.eraseCase2(node);
  }

  /**
   * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param node
   */
  eraseCase2(node: TreeNode) {
    let s = node.getSiblingNode();

    if (this.isRed(s as TreeNode)) {
      // @ts-ignore
      node.parent.color = RED;
      // @ts-ignore
      s.color = BLACK;

      // @ts-ignore
      if (node === node.parent.left) {
      // @ts-ignore
        this.rotateLeft(node.parent);
      } else {
      // @ts-ignore
        this.rotateRight(node.parent);
      }
    }
    this.eraseCase3(node);
  }

  /**
   * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param node
   */
  eraseCase3(node: TreeNode) {
    let s = node.getSiblingNode() as TreeNode;
    let p = node.parent as TreeNode;
    if (
      this.isBlack(p) &&
      this.isBlack(s) &&
      this.isBlack(s.left as TreeNode) &&
      this.isBlack(s.right as TreeNode)
    ) {
      s.color = NODE_COLORS.RED;
      this.eraseCase1(p);
    } else {
      this.eraseCase4(node);
    }
  }

  /**
   * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param node
   */
  eraseCase4(node: TreeNode) {
    let s = node.getSiblingNode() as TreeNode;
    let p = node.parent as TreeNode;
    if (
      this.isRed(p) &&
      this.isBlack(s) &&
      this.isBlack(s.left as TreeNode) &&
      this.isBlack(s.right as TreeNode)
    ) {
      s.color = NODE_COLORS.RED;
      p.color = NODE_COLORS.BLACK;
    } else {
      this.eraseCase5(node);
    }
  }

  /**
   * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param node
   */
  eraseCase5(node: TreeNode) {
    let s = node.getSiblingNode() as TreeNode;
    let p = node.parent as TreeNode;
    /* The check below is unnecessary
           due to case 2 (even though case 2 changed the sibling to a sibling's child,
           the sibling's child can't be red, since no red parent can have a red child). */
    /* if ((!this.isLeaf(s))
               && this.isBlack(s)) { */

    /* the following statements just force the red to be on the left of the left of the parent,
           or right of the right, so case six will rotate correctly. */
    if (node === p.left && this.isRed(s.left as TreeNode) && this.isBlack(s.right as TreeNode)) {
      s.color = NODE_COLORS.RED;
      (s.left as TreeNode).color = NODE_COLORS.BLACK;
      this.rotateRight(s);
    } else if (
      node === p.right &&
      this.isBlack(s.left) &&
      this.isRed(s.right)
    ) {
      s.color = TreeNode.NODE_COLORS.RED;
      (s.right as TreeNode).color = TreeNode.NODE_COLORS.BLACK;
      this.rotateLeft(s);
    }
    //}
    this.eraseCase6(node);
  }

  /**
   * @private
   * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param node
   */
  eraseCase6(node: TreeNode) {
    let s: any = node.getSiblingNode();
    let p: any = node.parent;
    s.color = this.fetchColor(p);
    p.color = NODE_COLORS.BLACK;

    if (node === p.left) {
      // @ts-ignore
      s.right.color = BLACK;
      this.rotateLeft(p);
    } else {
      // @ts-ignore
      s.left.color = BLACK;
      this.rotateRight(p);
    }
  }

  /* ===========================
       SEARCH BY KEY
       =========================== */
  /**
   * @returns an iterator pointin to a node with matching key value. If node is not found then end() iterator is returned.
   * @param {*} k - key value
   */
  find(k: any) {
    let y: any = this.head;
    let x: any = y.root;
    while (!this.isLeaf(x)) {
      let rc = this.compare(x.key, k);
      if (rc > 0) {
        y = x;
        x = x.left;
      } else if (rc < 0) {
        y = x;
        x = x.right;
      } else {
        return new Iterator(x, this);
      }
    }
    return new Iterator(this.head, this);
  }

  /**
   * @returns an iterator pointing to the first node in the tree that is not less than
   * (i.e. greater or equal to) the specified key value, or end() if no such node is found.
   * @param {*} k - key value
   */
  lowerBound(k: any) {
    let y: any = this.head;
    let x: any = y.root;
    while (!this.isLeaf(x)) {
      let rc = this.compare(x.key, k);
      if (rc >= 0) {
        y = x;
        x = x.left;
      } else {
        x = x.right;
      }
    }
    return new Iterator(y, this);
  }

  /**
   * the specified key value, or end() if no such node is found.
   * @param k key value
   * @returns an iterator pointing to the first node in the tree that is greater than
   */
  upperBound(k: any) {
    let y = this.head;
    let x = y.root;
    while (!this.isLeaf(x)) {
      // @ts-ignore
      let rc = this.compare(x.key, k);
      if (rc > 0) {
        y = x;
        // @ts-ignore
        x = x.left;
      } else {
        // @ts-ignore
        x = x.right;
      }
    }
    return new Iterator(y, this);
  }

  /**
   * @param node
   */
  fetchColor(node: TreeNode | null): NODE_COLORS {
    if (this.isLeaf(node)) {
      return NODE_COLORS.BLACK;
    } else {
      return (node as TreeNode).color;
    }
  }

  entries() {
    return new JsIterator(this);
  }

  keys() {
    return new JsIterator(this, new KeyOnlyPolicy());
  }

  [Symbol.iterator]() {
    return new JsIterator(this);
  }

  backward() {
    return new JsReverseIterator(this);
  }
}

export default RBTree;
