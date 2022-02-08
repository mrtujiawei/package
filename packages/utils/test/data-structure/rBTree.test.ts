import { NODE_COLORS } from '../../src/data-structure/RBTree/enums';
import TreeNode from '../../src/data-structure/RBTree/TreeNode';
import { RBTree } from '../../src/index';

/**
 * 验证是否满足红黑树性质
 */
describe('RBTree Properties test', () => {
  const size = 100000;
  const tree = new RBTree<number, number>((a, b) => a - b);
  const options = { length: size };
  const sorter = () => (Math.random() < 0.5 ? 1 : -1);
  const mapper = (_: any, index: number) => 1 + index;
  const nums = Array.from(options, mapper).sort(sorter);

  test('insert test', () => {
    nums.forEach((num) => {
      tree.insertMultiple(num, num);
    });
  });

  test('min value test', () => {
    expect(Math.min(...nums)).toBe(tree.getMin());
  });

  test('max value test', () => {
    expect(Math.max(...nums)).toBe(tree.getMax());
  });

  const result: number[] = [];
  test('key value test', () => {
    tree.forEach((key, value) => {
      if (key != value) {
        console.warn('数据有误');
      }
      result.push(key);
    });
  });

  test('value sort test', () => {
    for (let i = 1; i < size; i++) {
      expect(result[i - 1]).toBeLessThan(result[i]);
    }
  });

  test('node size test', () => {
    expect(size).toBe(result.length);
  });

  // 1. 节点是红色或黑色
  test('node color is red or black and no continuous red nodes', () => {
    let count = 0;
    const helper = (node: TreeNode<number, number>) => {
      if (node) {
        if (node.parent) {
          if (
            node.parent.color == NODE_COLORS.RED &&
            node.color == NODE_COLORS.RED
          ) {
            // 颜色不对
            expect(node.color).toBe(NODE_COLORS.BLACK);
          }
        }
        helper(node.left);
        helper(node.right);
        count++;
      }
    };
    // @ts-ignore
    helper(tree.root);
    expect(count).toBe(size);
  });

  // 2. 根是黑色
  test('root node color should be black', () => {
    // @ts-ignore
    const root = tree.root;
    expect(root.color).toBe(NODE_COLORS.BLACK);
  });

  // 5. 从任一节点到其每个叶子的所有简单路径都包含相同数目的黑色节点
  test('node to left path has same black nodes', () => {
    // @ts-ignore
    const root = tree.root;

    const helper = (node: TreeNode<number, number>): number => {
      // 不存在则是叶子节点
      // 叶节点为黑色节点
      if (!node) {
        return 1;
      }
      let leftBlacks = helper(node.left);
      let rightBlacks = helper(node.right);
      expect(leftBlacks).toBe(rightBlacks);
      if (node.color == NODE_COLORS.BLACK) {
        return leftBlacks + 1;
      }
      return leftBlacks;
    };

    helper(root);
  });

  test('min path and max path', () => {
    // @ts-ignore
    const root = tree.root;

    let minPath = Number.MAX_SAFE_INTEGER;
    let maxPath = Number.MIN_SAFE_INTEGER;

    const helper = (node: TreeNode<number, number>, path: number) => {
      if (node) {
        path++;
        helper(node.left, path);
        helper(node.right, path);
      } else {
        minPath = Math.min(minPath, path);
        maxPath = Math.max(maxPath, path);
      }
    };

    helper(root, 0);
    console.log({
      minPath,
      maxPath,
    });
  });
});
