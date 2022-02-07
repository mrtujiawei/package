/**
 * 红黑树实现
 * 主要是一些操作类的东西和对外的接口
 * @filename: packages/utils/src/data-structure/RBTree/Tree.ts
 * @author: Mr Prince
 * @date: 2022-02-07 15:06:34
 */
import TreeNode from './TreeNode';
import { INSERT_MODE, NODE_COLORS } from './enums';
import InsertResult from './InsertResult';

// TODO 有点死循环，难搞

/**
 * 相关性质:
 * 1: 结点是红色或黑色
 * 2: 根结点是黑色
 * 3: 所有叶子都是黑色（叶子是null结点）
 * 4: 每个红色结点的两个子结点都是黑色（从每个叶子到根的所有路径上不能有两个连续的红色结点）
 * 5: 从任一节结点其每个叶子的所有路径都包含相同数目的黑色结点
 */
class RBTree<K, V> {
  /**
   * 根节点
   */
  private root!: TreeNode<K, V>;

  /**
   * 最小值
   */
  private minimum!: TreeNode<K, V>;

  /**
   * 最大值
   */
  private maximum!: TreeNode<K, V>;

  /**
   * 节点数
   */
  private nodeSize = 0;

  /**
   * 比较器
   */
  private comparator: (lhs: K, rhs: K) => number;

  /**
   * 不带数据的初始化
   * 因为插入操作需要考虑相同key时怎么操作
   */
  constructor(comparator: (lhs: K, rhs: K) => number) {
    this.comparator = comparator;
  }

  getSize() {
    return this.nodeSize;
  }

  isEmpty() {
    return 0 == this.nodeSize;
  }

  /**
   * 插入节点
   * @description 允许有节点有相同的key
   */
  insertMultiple(key: K, value: V) {
    this.insert(new TreeNode<K, V>(key, value), INSERT_MODE.MULTIPLE);
  }

  /**
   * 插入节点
   * @description 不允许有相同的key,有则忽略插入节点
   */
  insertUnique(key: K, value: V) {
    this.insert(new TreeNode<K, V>(key, value), INSERT_MODE.UNIQUE);
  }

  /**
   * 插入节点
   * @description 有相同节点的，直接替换为新节点
   */
  insertOrReplace(key: K, value: V) {
    this.insert(new TreeNode<K, V>(key, value), INSERT_MODE.REPLACE);
  }

  /**
   * 移除节点
   */
  remove(key: K) {
    // TODO
    console.log(key);
    return null;
  }

  clear() {
    // @ts-ignore
    this.root = this.minimum = this.maximum = null;
    this.nodeSize = 0;
  }

  forEach(callback: (key: K, value: V) => void) {
    const helper = (node: TreeNode<K, V>) => {
      if (node) {
        helper(node.left);
        callback(node.key, node.value);
        helper(node.right);
      }
    };

    helper(this.root);
  }

  /**
   * 节点比较
   */
  private compareNode(lhs: TreeNode<K, V>, rhs: TreeNode<K, V>) {
    return this.comparator(lhs.key, rhs.key);
  }

  /**
   * 判断是不是叶节点
   */
  private isLeaf(node: TreeNode<K, V>) {
    return null == node;
  }

  private isRoot(node: TreeNode<K, V>) {
    return this.root == node;
  }

  /**
   * 替换节点,旋转时会用到
   * @description 修改节点的父节点及父节点对应的子节点
   */
  private replaceNode(oldNode: TreeNode<K, V>, newNode: TreeNode<K, V>) {
    if (oldNode == newNode) {
      return;
    }

    // 没有父节点说明是根节点
    if (null == oldNode.parent) {
      this.root = newNode;
    } else {
      if (oldNode == oldNode.parent.left) {
        oldNode.parent.left = newNode;
      } else {
        oldNode.parent.right = newNode;
      }
    }

    // 原来的父节点给他挂上去
    // 除了根节点和叶节点不需要设置父节点
    if (!this.isLeaf(newNode) && !this.isRoot(newNode)) {
      newNode.parent = oldNode.parent;
    }
  }

  /**
   * ===================
   *      节点旋转
   * ===================
   *
   *     X                Y
   *    / \              / \
   *   Y   c  右旋 -->  a   X
   *  / \     <-- 左旋     / \
   * a   b                b   c
   */

  /**
   * 左旋
   * @param node - 参考Y节点
   */
  private rotateLeft(node: TreeNode<K, V>) {
    // 参考 X 节点
    const right = node.right;
    if (this.isLeaf(right)) {
      throw new Error('无法左旋，红黑树已损坏');
    }
    this.replaceNode(node, right);
    node.right = right.left;
    if (null != right.left) {
      right.left.parent = node;
    }
    right.left = node;
    node.parent = right;
  }

  /**
   * 右旋
   * @param node - 参考X节点
   */
  private rotateRight(node: TreeNode<K, V>) {
    // 参考Y节点
    const left = node.left;
    if (this.isLeaf(left)) {
      throw new Error('无法右旋，红黑树已损坏');
    }
    this.replaceNode(node, left);
    node.left = left.right;
    if (left.right != null) {
      left.right.parent = node;
    }
    left.right = node;
    node.parent = left;
  }

  /**
   * 获取节点颜色
   */
  private fetchColor(node: TreeNode<K, V>) {
    if (this.isLeaf(node) || this.isRoot(node)) {
      return NODE_COLORS.BLACK;
    }
    return node.color;
  }

  /**
   * 判断节点颜色
   */
  private isBlack(node: TreeNode<K, V>) {
    return this.fetchColor(node) == NODE_COLORS.BLACK;
  }

  /**
   * 判断节点颜色
   */
  private isRed(node: TreeNode<K, V>) {
    return this.fetchColor(node) == NODE_COLORS.RED;
  }

  /**
   * 插入节点，处理相关变更
   */
  private insert(node: TreeNode<K, V>, mode: INSERT_MODE) {
    const result = this.insertNode(this.root, node, mode);
    if (result.isAdded()) {
      if (this.isEmpty()) {
        this.root = node;
        this.minimum = node;
        this.maximum = node;
      } else if (this.minimum.left == node) {
        // 更新最小值
        this.minimum = node;
      } else if (this.maximum.right == node) {
        // 更新最大值
        this.maximum = node;
      }
      this.insertRepairTree(node);
      this.nodeSize++;
    }
    return result;
  }

  private insertNode(
    root: TreeNode<K, V>,
    node: TreeNode<K, V>,
    mode: INSERT_MODE
  ) {
    let parent = root;

    // 保存最后一个有效的父节点
    let child!: TreeNode<K, V>;
    let compare = -1;
    while (!this.isLeaf(parent)) {
      child = parent;
      compare = this.compareNode(node, child);
      if (0 > compare) {
        parent = child.left;
      } else if (0 < compare) {
        parent = child.right;
      } else {
        // 找到key相同的节点
        if (INSERT_MODE.UNIQUE == mode) {
          return new InsertResult(false, false);
        } else if (INSERT_MODE.REPLACE == mode) {
          // 和原来的有点不一样
          // 既然替换了就把节点的key、value都替换掉
          child.key = node.key;
          child.value = node.value;
          return new InsertResult(false, true);
        } else {
          // 需要插入重复节点
          // 往右边找
          parent = child.right;
        }
      }
    }

    /**
     * 只有根节点是null时才可能进这个if
     */
    if (this.isLeaf(child)) {
      // 处理成根节点
      // @ts-ignore
      node.parent = null;
    } else {
      node.parent = child;
      if (0 > compare) {
        child.left = node;
      } else {
        child.right = node;
      }
    }

    return new InsertResult(true, false);
  }

  /**
   * 开始插入操作的修复
   * 文档可能会不一样，因为英文版的文档已经完全不同了
   * {@link https://zh.wikipedia.org/wiki/%E7%BA%A2%E9%BB%91%E6%A0%91#%E6%8F%92%E5%85%A5 插入操作说明}
   */
  private insertRepairTree(node: TreeNode<K, V>) {
    if (null == node.parent) {
      this.repairCase1(node);
    } else if (this.isBlack(node.parent)) {
      this.repairCase2(node);
    } else if (this.isRed(node.getUncle())) {
      this.repairCase3(node);
    } else {
      this.repairCase4(node);
    }
  }

  /**
   * 情况1: 插入的节点是根节点
   * 直接把该节点颜色改成黑色就行
   */
  private repairCase1(node: TreeNode<K, V>) {
    node.color = NODE_COLORS.BLACK;
  }

  /**
   * 情况2: 新节点的父节点是黑色
   * 不需要做任何处理
   */
  private repairCase2(node: TreeNode<K, V>) {
    node;
  }

  /**
   * 情形3: 父节点和叔父节点二者都是红色
   */
  private repairCase3(node: TreeNode<K, V>) {
    node.parent.color = NODE_COLORS.BLACK;
    node.getUncle().color = NODE_COLORS.BLACK;
    node.getGrandparent().color = NODE_COLORS.RED;
    this.insertRepairTree(node.getGrandparent());
  }

  /**
   * 情形4: 父节点P是红色而叔父节点U是黑色或缺少
   *        并且新节点是其父节点的右子节点而父节点又是其父节点的左子节点
   */
  private repairCase4(node: TreeNode<K, V>) {
    let parent = node.parent;
    let grandparent = node.getGrandparent();

    // 新节点node是其父节点P的右子节点而父节点P又是其父节点的左子节点
    // 因为我的左旋和右旋中旋转的对象不一样，所以传入的参数不一样
    // 维基百科中的旋转操作是根据当前节点，我的旋转操作是根据旋转的顶点去旋转的
    if (null != grandparent.left && node == grandparent.left.right) {
      this.rotateLeft(parent);
      node = node.left;
    } else if (null != grandparent.right && node == grandparent.right.left) {
      this.rotateRight(parent);
      node = node.right;
    }

    this.repaireCase5(node);
  }


  /**
   * 情况5: 父节点P是红色而叔父节点U是黑色
   * 情形4 完成之后一定为情形5
   */
  private repaireCase5(node: TreeNode<K, V>) {
    const parent = node.parent;
    const grandparent = node.getGrandparent();

    if (node == parent.left && parent == grandparent.left) {
      this.rotateRight(grandparent);
    } else {
      this.rotateLeft(grandparent);
    }

    parent.color = NODE_COLORS.BLACK;
    grandparent.color = NODE_COLORS.RED;
  }
}

export default RBTree;
