/**
 * 红黑树实现
 * 主要是一些操作类的东西和对外的接口
 * @filename: packages/utils/src/data-structure/RBTree/Tree.ts
 * @author: Mr Prince
 * @date: 2022-02-07 15:06:34
 */
import TreeNode from './TreeNode';
import { INSERT_MODE, } from './enums';

/**
 * 相关性质:
 * 1: 结点是红色或黑色
 * 2: 根结点是黑色
 * 3: 所有叶子都是黑色（叶子是null结点）
 * 4: 每个红色结点的两个子结点都是黑色（从每个叶子到根的所有路径上不能有两个连续的红色结点）
 * 5: 从任一节结点其每个叶子的所有路径都包含相同数目的黑色结点
 */
class RBTree<K, V> {
  root!: TreeNode<K, V>;

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

  private insert(node: TreeNode<K, V>, mode: INSERT_MODE) {
    console.log(node, mode);
  }

  remove(key: K) {
    console.log(key);
    return null;
  }
}

export default RBTree;
