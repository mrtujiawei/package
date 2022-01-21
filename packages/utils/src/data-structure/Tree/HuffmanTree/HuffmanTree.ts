/**
 * HuffmanTree
 * 将一个 字符串 用 二进制表示 的压缩算法
 * @filename packages/utils/src/data-structure/Tree/HuffmanTree/HuffmanTree.ts
 * @author Mr Prince
 * @date 2023-02-09 10:17:28
 */
import TreeNode from './TreeNode';
import MapEnhancer from '../../MapEnhancer';

class HuffmanTree {
  private tree: TreeNode | null;
  private binaryStr: string;

  /**
   * 1. 统计字符出现频率
   * 2. 构造哈夫曼树
   * 3. 取得编码对照表
   * 4. 返回最终的二进制编码
   * @param str 需要编码的字符串
   */
  constructor(str: string) {
    const counter = this.count(str);
    this.tree = this.getHuffmanTree(counter);
    let map = this.getHuffmanCodeTable(this.tree);
    this.binaryStr = this.getBinaryStr(map, str);
  }

  /**
   * 统计字符出现频率
   */
  private count(str: string) {
    const counter = new Map<string, number>();
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      MapEnhancer.increase(counter, ch);
    }
    return counter;
  }

  /**
   * 根据字符出现频率构造哈夫曼树
   * 选择两个频率最低的，较低的放左边，较高的放右边
   * 并将两个节点的频率相加，形成新的节点，放入森林中
   * 直到最后只剩下一个根节点，就是形成了树
   */
  private getHuffmanTree(counter: Map<string, number>) {
    let forest: TreeNode[] = [];
    counter.forEach((value, key) => {
      let node = new TreeNode(value, key);
      forest.push(node);
    });

    while (forest.length > 1) {
      forest.sort((a, b) => b.val - a.val);
      const left = forest.pop()!;
      const right = forest.pop()!;
      const node = new TreeNode(left.val + right.val, '', left, right);
      forest.push(node);
    }

    return forest[0];
  }

  // 遍历哈夫曼树，返回一个 原始字符 和 二进制编码 的对照表
  private getHuffmanCodeTable(tree: TreeNode) {
    const map = new Map<string, string>();
    let traversal = (node: TreeNode, curPath: string) => {
      if (!node.left && !node.right) return;
      if (node.left && !node.left.left && !node.left.right) {
        map.set(node.left.char, curPath + '0');
      }
      if (node.right && !node.right.left && !node.right.right) {
        map.set(node.right.char, curPath + '1');
      }
      // 往左遍历，路径加0
      if (node.left) {
        traversal(node.left, curPath + '0');
      }
      // 往右遍历，路径加1
      if (node.right) {
        traversal(node.right, curPath + '1');
      }
    };
    traversal(tree, '');
    return map;
  }

  /**
   * 计算最终的压缩后的二进制串
   * @param map 编码对照表
   * @param originStr 原始待编码字符串
   */
  private getBinaryStr(map: Map<string, string>, originStr: string) {
    let result: string[] = [];
    for (let i = 0; i < originStr.length; i++) {
      result.push(map.get(originStr[i])!);
    }
    return result.join('');
  }

  encode() {
    return this.binaryStr;
  }

  /**
   * 如果返回为空字符串
   * 表示解码失败
   */
  decode(str: string) {
    const result: string[] = [];
    let p = 0;
    let node = this.tree;
    if (node) {
      while (p < str.length) {
        const value = str[p++];
        if (value == '0') {
          if (node.left) {
            node = node.left;
          } else {
            p--;
            result.push(node.char);
            node = this.tree!;
          }
        } else {
          if (node.right) {
            node = node.right;
          } else {
            p--;
            result.push(node.char);
            node = this.tree!;
          }
        }
      }
    }

    if (node?.char) {
      result.push(node.char);
    }

    return result.join('');
  }
}

export default HuffmanTree;
