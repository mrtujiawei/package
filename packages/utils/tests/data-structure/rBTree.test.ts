import { NODE_COLORS } from '../../src/data-structure/Tree/RBTree/enums';
import TreeNode from '../../src/data-structure/Tree/RBTree/TreeNode';
import { Random, RBTree, toString } from '../../src/index';

const size = 1000;

const buildTree = (...values: number[]) => {
  const tree = new RBTree<number, number>((a, b) => a - b);
  values.forEach(value => {
    tree.insertMultiple(value, value);
  });
  return tree;
};

const buildRandomNums = () => {
  const options = { length: size };
  const sorter = () => (Math.random() < 0.5 ? 1 : -1);
  const mapper = (_: any, index: number) => 1 + index;
  const nums = Array.from(options, mapper).sort(sorter);
  return nums;
};

const validNode = (
  node: TreeNode<number, number>,
  key: number,
  value: number,
  color: NODE_COLORS,
  parent: TreeNode<number, number> | null,
) => {
  expect(node.key).toBe(key);
  expect(node.value).toBe(value);
  expect(node.color).toBe(color);
  expect(node.parent).toBe(parent);
};

/**
 * 验证是否满足红黑树性质
 */
describe('RBTree properties test', () => {
  const tree = buildTree();
  const nums = buildRandomNums();

  test('insert test', () => {
    nums.forEach((num, index) => {
      expect(tree.getSize()).toBe(index);
      tree.insertMultiple(num, num);
      expect(tree.getSize()).toBe(index + 1);
    });
    expect(tree.getSize()).toBe(size);
  });

  test('min value test', () => {
    expect(Math.min(...nums)).toBe(tree.getMin());
  });

  test('max value test', () => {
    expect(Math.max(...nums)).toBe(tree.getMax());
  });

  const result: number[] = [];
  test('key value test', () => {
    tree.forEach((value, key) => {
      expect(key).toBe(value);
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
    expect(maxPath).toBeLessThan(minPath * 2);
  });
});

describe('RBTree methods test', () => {
  test('Delete test', () => {
    const tree = buildTree();
    const nums = buildRandomNums();

    expect(tree.getSize()).toBe(0);
    tree.clear();
    expect(tree.getSize()).toBe(0);

    nums.forEach((num) => {
      tree.insertMultiple(num, num);
    });

    expect(tree.getSize()).toBe(size);
    tree.clear();
    expect(tree.getSize()).toBe(0);

    nums.forEach((num) => {
      tree.insertMultiple(num, num);
    });
    expect(tree.getSize()).toBe(size);

    const removedNums = new Set<number>();
    const getUnremoveKey = (): number => {
      let removeIndex = Random.getRandomNumber(0, size);
      let removeKey = nums[removeIndex];
      while (removedNums.has(removeKey)) {
        removeIndex = Random.getRandomNumber(0, size);
        removeKey = nums[removeIndex];
      }
      return removeKey;
    };

    for (let i = 0; i < size; i++) {
      const key = getUnremoveKey();
      // 重复移除确定不报错
      tree.remove(key);
      tree.remove(key);
      removedNums.add(key);
      expect(tree.getSize()).toBe(size - removedNums.size);
      expect(tree.getSize()).toBe(size - removedNums.size);
    }

    expect(tree.getSize()).toBe(0);

    // 为空时也可以调用移除
    tree.remove(nums[0]);
    expect(tree.getSize()).toBe(0);
    expect(tree.isEmpty()).toBe(true);
  });

  test('Insert same value test', () => {
    const tree = buildTree();
    tree.insertUnique(0, 0);
    tree.insertUnique(0, 1);
    expect(tree.getSize()).toBe(1);
    expect(tree.getValue(0)).toBe(0);
    tree.forEach((value, key) => {
      if (0 == key) {
        expect(value).toBe(0);
      }
    });
    tree.insertOrReplace(0, 2);
    expect(tree.getValue(0)).toBe(2);
    tree.forEach((value, key) => {
      if (0 == key) {
        expect(value).toBe(2);
      }
    });
    tree.insertMultiple(0, 3);

    const sameValues: number[] = [];
    tree.forEach((value, key) => {
      if (0 == key) {
        sameValues.push(value);
      }
    });
    sameValues.sort((a, b) => a - b);
    expect(sameValues[0]).toBe(2);
    expect(sameValues[1]).toBe(3);
  });

  test('Replace root node test', () => {
    const tree = buildTree();
    const key = 0;
    const value = 1;
    tree.insertOrReplace(key, value);

    // @ts-ignore
    let root = tree.root;
    expect(root.key).toBe(key);
    expect(root.value).toBe(value);
    expect(!root.left).toBe(true);
    expect(!root.right).toBe(true);
    expect(root.color).toBe(NODE_COLORS.BLACK);
    expect(!root.parent).toBe(true);
    expect(!root.getUncle()).toBe(true);
    expect(!root.getSibling()).toBe(true);
    expect(!root.getGrandparent()).toBe(true);
    const newValue = 2;
    tree.insertOrReplace(key, newValue);

    // @ts-ignore
    root = tree.root;
    expect(root.key).toBe(key);
    expect(root.value).toBe(newValue);
    expect(!root.left).toBe(true);
    expect(!root.right).toBe(true);
    expect(root.color).toBe(NODE_COLORS.BLACK);
    expect(!root.parent).toBe(true);
    expect(!root.getUncle()).toBe(true);
    expect(!root.getSibling()).toBe(true);
    expect(!root.getGrandparent()).toBe(true);
  });

  test('GetMin test', () => {
    const tree = buildTree();
    const nums = buildRandomNums();
    let min = Number.MAX_SAFE_INTEGER;
    nums.forEach((value, index) => {
      tree.insertMultiple(value, index);
      min = Math.min(value, min);
      expect(nums[tree.getMin()]).toBe(min);
    });
    for (let i = 1; i <= size; i++) {
      expect(nums[tree.getMin()]).toBe(i);
      tree.remove(i);
    }
  });

  test('GetMax test', () => {
    const tree = buildTree();
    const nums = buildRandomNums();
    let max = Number.MIN_SAFE_INTEGER;
    nums.forEach((value, index) => {
      tree.insertMultiple(value, index);
      max = Math.max(value, max);
      expect(nums[tree.getMax()]).toBe(max);
    });
    for (let i = size; i > 0; i--) {
      expect(nums[tree.getMax()]).toBe(i);
      tree.remove(i);
    }
  });

  test('Remove case 1', () => {
    const tree = buildTree();
    const key = Random.getRandomNumber(0, size);
    const value = Random.getRandomNumber(0, size);

    tree.insertUnique(key, value);

    tree.remove(key);

    // @ts-ignore
    expect(!tree.root).toBe(true);

    // @ts-ignore
    expect(!tree.minimum).toBe(true);

    // @ts-ignore
    expect(!tree.maximum).toBe(true);
  });

  test('Remove: replace by left max value child', () => {
    const tree = buildTree();
    tree.insertUnique(2, 2);
    tree.insertUnique(1, 1);
    tree.insertUnique(3, 3);

    // @ts-ignore
    let root = tree.root;
    expect(root.key).toBe(2);
    expect(root.value).toBe(2);
    // @ts-ignore
    expect(root.left).toBe(tree.minimum);
    // @ts-ignore
    expect(root.right).toBe(tree.maximum);
    expect(root.color).toBe(NODE_COLORS.BLACK);
    expect(root.parent).toBeNull();

    tree.remove(2);

    // @ts-ignore
    root = tree.root;
    expect(root.key).toBe(1);
    expect(root.value).toBe(1);
    expect(!root.left).toBe(true);
    // @ts-ignore
    expect(root.right).toBe(tree.maximum);
    expect(root.color).toBe(NODE_COLORS.BLACK);
    expect(root.parent).toBeNull();
    expect(root.right.parent).toBe(root);

    // @ts-ignore
    expect(tree.minimum).toBe(tree.root);
    const right = root.right;
    expect(right.color).toBe(NODE_COLORS.RED);
    expect(!right.getSibling()).toBe(true);
    expect(right.key).toBe(3);
  });

  test('Remove: delete minimum', () => {
    const tree = buildTree();
    tree.insertUnique(2, 2);
    tree.insertUnique(1, 1);
    tree.insertUnique(3, 3);
    // @ts-ignore
    let root = tree.root;
    let right = root.right;
    tree.remove(1);
    // @ts-ignore
    expect(tree.root).toBe(root);
    expect(!root.left).toBe(true);
    expect(root.right).toBe(right);
    // @ts-ignore
    expect(tree.minimum).toBe(tree.root);
    // @ts-ignore
    expect(tree.maximum).toBe(tree.root.right);
  });

  test('Remove: delete minimum 2', () => {
    const tree = buildTree();
    [10, 8, 12, 6, 14].forEach(value => {
      tree.insertUnique(value, value);
    });

    // @ts-ignore
    let root = tree.root;

    validNode(root, 10, 10, NODE_COLORS.BLACK, null);
    validNode(root.left, 8, 8, NODE_COLORS.BLACK, root);
    validNode(root.right, 12, 12, NODE_COLORS.BLACK, root);
    validNode(root.left.left, 6, 6, NODE_COLORS.RED, root.left);
    validNode(root.right.right, 14, 14, NODE_COLORS.RED, root.right);
    // @ts-ignore
    expect(tree.minimum).toBe(root.left.left);
    // @ts-ignore
    expect(tree.maximum).toBe(root.right.right);

    tree.remove(6);

    validNode(root, 10, 10, NODE_COLORS.BLACK, null);
    validNode(root.left, 8, 8, NODE_COLORS.BLACK, root);
    validNode(root.right, 12, 12, NODE_COLORS.BLACK, root);
    validNode(root.right.right, 14, 14, NODE_COLORS.RED, root.right);

    // @ts-ignore
    expect(tree.minimum).toBe(root.left);
    // @ts-ignore
    expect(tree.maximum).toBe(root.right.right);
  });

  test('Remove: delete as 1 2 3', () => {
    const tree = buildTree();
    tree.insertUnique(2, 0);
    tree.insertUnique(1, 1);
    tree.insertUnique(3, 2);
    tree.remove(1);
    tree.remove(2);
    // @ts-ignore
    validNode(tree.root, 3, 2, NODE_COLORS.BLACK, null);
    expect(tree.getSize()).toBe(1);
    tree.remove(3);
    // @ts-ignore
    expect(tree.root).toBe(null);
  });

  test('Remove: remove as 1 3', () => {
    const tree = buildTree();
    tree.insertUnique(1, Random.getRandomNumber(0, size));
    tree.insertUnique(3, Random.getRandomNumber(0, size));
    tree.remove(1);
    tree.remove(3);
    expect(tree.getSize()).toBe(0);
    // @ts-ignore
    expect(!tree.root).toBe(true);
  });

  test('Remove: remove as 3 1', () => {
    const tree = buildTree();
    tree.insertUnique(1, Random.getRandomNumber(0, size));
    tree.insertUnique(3, Random.getRandomNumber(0, size));
    tree.remove(3);
    tree.remove(1);
    expect(tree.getSize()).toBe(0);
    // @ts-ignore
    expect(!tree.root).toBe(true);
  });

  test('Remove: remove maximum', () => {
    const tree = buildTree(2, 1, 3);
    tree.remove(3);
    // @ts-ignore
    const root = tree.root;
    validNode(root, 2, 2, NODE_COLORS.BLACK, null);
    validNode(root.left, 1, 1, NODE_COLORS.RED, root);
    expect(!root.right).toBe(true);
    expect(tree.getMax()).toBe(2);
  });

  test('Remove: remove maximum(14)', () => {
    const tree = buildTree(10, 8, 12, 6, 14);
    tree.remove(14);
    // @ts-ignore
    const root = tree.root;
    validNode(root, 10, 10, NODE_COLORS.BLACK, null);
    validNode(root.left, 8, 8, NODE_COLORS.BLACK, root);
    validNode(root.right, 12, 12, NODE_COLORS.BLACK, root);
    validNode(root.left.left, 6, 6, NODE_COLORS.RED, root.left);
    expect(!root.right.right).toBe(true);
  });

  test('Remove: remove maximum and root', () => {
    const tree = buildTree(2, 1, 3);
    tree.remove(3);
    tree.remove(2);

    // @ts-ignore
    const root = tree.root;
    validNode(root, 1, 1, NODE_COLORS.BLACK, null);
    expect(!root.left).toBeTruthy();
    expect(!root.right).toBeTruthy();
    expect(tree.getMax()).toBe(1);
    expect(tree.getMin()).toBe(1);
    expect(tree.getSize()).toBe(1);
  });

  test('Remove: remove node with a single left child', () => {
    const tree = buildTree(20, 10, 30, 25, 35, 22);
    tree.remove(25);

    // @ts-ignore
    const root = tree.root;
    validNode(root, 20, 20, NODE_COLORS.BLACK, null);

    validNode(root.left, 10, 10, NODE_COLORS.BLACK, root);
    validNode(root.right, 30, 30, NODE_COLORS.BLACK, root);
    validNode(root.right.left, 22, 22, NODE_COLORS.RED, root.right);
    validNode(root.right.right, 35, 35, NODE_COLORS.RED, root.right);
  });

  test('Remove: remove node with a single right child', () => {
    const tree = buildTree(20, 10, 30, 25, 35, 27);
    tree.remove(25);

    // @ts-ignore
    const root = tree.root;
    validNode(root, 20, 20, NODE_COLORS.BLACK, null);

    validNode(root.left, 10, 10, NODE_COLORS.BLACK, root);
    validNode(root.right, 30, 30, NODE_COLORS.BLACK, root);
    validNode(root.right.left, 27, 27, NODE_COLORS.RED, root.right);
    validNode(root.right.right, 35, 35, NODE_COLORS.RED, root.right);
  });

  test('Remove: remove repair case 2 4 (left child)', () => {
    const tree = buildTree(20, 10, 30, 5, 25, 35, 40);
    tree.remove(5);
    tree.remove(40);

    // @ts-ignore
    let root = tree.root;
    validNode(root, 20, 20, NODE_COLORS.BLACK, null);
    validNode(root.left, 10, 10, NODE_COLORS.BLACK, root);
    validNode(root.right, 30, 30, NODE_COLORS.RED, root);
    validNode(root.right.left, 25, 25, NODE_COLORS.BLACK, root.right);
    validNode(root.right.right, 35, 35, NODE_COLORS.BLACK, root.right);

    tree.remove(10);
    // @ts-ignore
    root = tree.root;

    validNode(root, 30, 30, NODE_COLORS.BLACK, null);
    validNode(root.left, 20, 20, NODE_COLORS.BLACK, root);
    validNode(root.right, 35, 35, NODE_COLORS.BLACK, root);
    validNode(root.left.right, 25, 25, NODE_COLORS.RED, root.left);
  });

  test('Remove: remove repair case 2 4 (right child)', () => {
    const tree = buildTree(20, 10, 30, 5, 15, 18);
    tree.remove(18);

    // @ts-ignore
    let root = tree.root;
    validNode(root, 20, 20, NODE_COLORS.BLACK, null);
    validNode(root.left, 10, 10, NODE_COLORS.RED, root);
    validNode(root.right, 30, 30, NODE_COLORS.BLACK, root);
    validNode(root.left.left, 5, 5, NODE_COLORS.BLACK, root.left);
    validNode(root.left.right, 15, 15, NODE_COLORS.BLACK, root.left);

    tree.remove(30);

    // @ts-ignore
    root = tree.root;
    validNode(root, 10, 10, NODE_COLORS.BLACK, null);
    validNode(root.left, 5, 5, NODE_COLORS.BLACK, root);
    validNode(root.right, 20, 20, NODE_COLORS.BLACK, root);
    validNode(root.right.left, 15, 15, NODE_COLORS.RED, root.right);
  });

  test('Remove: remove repair case 3 5 6 (left child)', () => {
    const tree = buildTree(20, 10, 30, 5, 15, 25, 35, 40);

    tree.remove(40);
    [12, 17, 16].forEach(value => {
      tree.insertMultiple(value, value);
    });

    // 初始状态检查
    // @ts-ignore
    let root = tree.root;
    validNode(root, 20, 20, NODE_COLORS.BLACK, null);
    validNode(root.left, 10, 10, NODE_COLORS.BLACK, root);
    validNode(root.right, 30, 30, NODE_COLORS.BLACK, root);
    validNode(root.left.left, 5, 5, NODE_COLORS.BLACK, root.left);
    validNode(root.left.right, 15, 15, NODE_COLORS.RED, root.left);
    validNode(root.right.left, 25, 25, NODE_COLORS.BLACK, root.right);
    validNode(root.right.right, 35, 35, NODE_COLORS.BLACK, root.right);
    validNode(root.left.right.left, 12, 12, NODE_COLORS.BLACK, root.left.right);
    validNode(root.left.right.right, 17, 17, NODE_COLORS.BLACK, root.left.right);
    validNode(root.left.right.right.left, 16, 16, NODE_COLORS.RED, root.left.right.right);

    // case 3
    tree.remove(25);

    // @ts-ignore
    root = tree.root;

    validNode(root, 15, 15, NODE_COLORS.BLACK, null);
    validNode(root.left, 10, 10, NODE_COLORS.BLACK, root);
    validNode(root.right, 20, 20, NODE_COLORS.BLACK, root);
    validNode(root.left.left, 5, 5, NODE_COLORS.BLACK, root.left);
    validNode(root.left.right, 12, 12, NODE_COLORS.BLACK, root.left);
    validNode(root.right.left, 17, 17, NODE_COLORS.BLACK, root.right);
    validNode(root.right.right, 30, 30, NODE_COLORS.BLACK, root.right);
    validNode(root.right.left.left, 16, 16, NODE_COLORS.RED, root.right.left);
    validNode(root.right.right.right, 35, 35, NODE_COLORS.RED, root.right.right);
  });

  test('Remove: remove repair case 3 5 6 (right child)', () => {
    const tree = buildTree(20, 10, 30, 5, 15, 25, 35, 40);
    tree.remove(40);
    [12, 17, 16].forEach(value => {
      tree.insertMultiple(value, value);
    });

    // 初始状态检查
    // @ts-ignore
    let root = tree.root;
    validNode(root, 20, 20, NODE_COLORS.BLACK, null);
    validNode(root.left, 10, 10, NODE_COLORS.BLACK, root);
    validNode(root.right, 30, 30, NODE_COLORS.BLACK, root);
    validNode(root.left.left, 5, 5, NODE_COLORS.BLACK, root.left);
    validNode(root.left.right, 15, 15, NODE_COLORS.RED, root.left);
    validNode(root.right.left, 25, 25, NODE_COLORS.BLACK, root.right);
    validNode(root.right.right, 35, 35, NODE_COLORS.BLACK, root.right);
    validNode(root.left.right.left, 12, 12, NODE_COLORS.BLACK, root.left.right);
    validNode(root.left.right.right, 17, 17, NODE_COLORS.BLACK, root.left.right);
    validNode(root.left.right.right.left, 16, 16, NODE_COLORS.RED, root.left.right.right);

    tree.remove(35);
    // @ts-ignore
    root = tree.root;
    validNode(root, 15, 15, NODE_COLORS.BLACK, null);
    validNode(root.left, 10, 10, NODE_COLORS.BLACK, root);
    validNode(root.right, 20, 20, NODE_COLORS.BLACK, root);
    validNode(root.left.left, 5, 5, NODE_COLORS.BLACK, root.left);
    validNode(root.left.right, 12, 12, NODE_COLORS.BLACK, root.left);
    validNode(root.right.left, 17, 17, NODE_COLORS.BLACK, root.right);
    validNode(root.right.right, 30, 30, NODE_COLORS.BLACK, root.right);
    validNode(root.right.left.left, 16, 16, NODE_COLORS.RED, root.right.left);
    validNode(root.right.right.left, 25, 25, NODE_COLORS.RED, root.right.right);
  });

  test('Remove: cases 5, 6 (red left child)', () => {
    const tree = buildTree(20, 10, 30, 5, 15, 25, 35, 40);
    tree.remove(40);
    [12, 17, 16].forEach(value => {
      tree.insertMultiple(value, value);
    });
    tree.remove(35);
    tree.remove(16);

    // 初始状态检查
    // @ts-ignore
    let root = tree.root;

    validNode(root, 15, 15, NODE_COLORS.BLACK, null);
    validNode(root.left, 10, 10, NODE_COLORS.BLACK, root);
    validNode(root.right, 20, 20, NODE_COLORS.BLACK, root);
    validNode(root.left.left, 5, 5, NODE_COLORS.BLACK, root.left);
    validNode(root.left.right, 12, 12, NODE_COLORS.BLACK, root.left);
    validNode(root.right.left, 17, 17, NODE_COLORS.BLACK, root.right);
    validNode(root.right.right, 30, 30, NODE_COLORS.BLACK, root.right);
    validNode(root.right.right.left, 25, 25, NODE_COLORS.RED, root.right.right);

    // case 5
    tree.remove(17);
    // @ts-ignore
    root = tree.root;
    validNode(root, 15, 15, NODE_COLORS.BLACK, null);
    validNode(root.left, 10, 10, NODE_COLORS.BLACK, root);
    validNode(root.right, 25, 25, NODE_COLORS.BLACK, root);
    validNode(root.left.left, 5, 5, NODE_COLORS.BLACK, root.left);
    validNode(root.left.right, 12, 12, NODE_COLORS.BLACK, root.left);
    validNode(root.right.left, 20, 20, NODE_COLORS.BLACK, root.right);
    validNode(root.right.right, 30, 30, NODE_COLORS.BLACK, root.right);
  });

  test('Remove: cae 5 6 (red left child 2)', () => {
    const tree = buildTree(20, 10, 30, 5, 15, 25, 35, 40);
    tree.remove(40);
    [12, 17, 16].forEach((value) => {
      tree.insertMultiple(value, value);
    });
    tree.remove(35);
    tree.remove(25);

    // 初始状态检查
    // @ts-ignore
    let root = tree.root;
    validNode(root, 15, 15, NODE_COLORS.BLACK, null);
    validNode(root.left, 10, 10, NODE_COLORS.BLACK, root);
    validNode(root.right, 20, 20, NODE_COLORS.BLACK, root);
    validNode(root.left.left, 5, 5, NODE_COLORS.BLACK, root.left);
    validNode(root.left.right, 12, 12, NODE_COLORS.BLACK, root.left);
    validNode(root.right.left, 17, 17, NODE_COLORS.BLACK, root.right);
    validNode(root.right.right, 30, 30, NODE_COLORS.BLACK, root.right);
    validNode(root.right.left.left, 16, 16, NODE_COLORS.RED, root.right.left);

    // case 5 6
    tree.remove(30);
    // @ts-ignore
    root = tree.root;
    validNode(root, 15, 15, NODE_COLORS.BLACK, null);
    validNode(root.left, 10, 10, NODE_COLORS.BLACK, root);
    validNode(root.right, 17, 17, NODE_COLORS.BLACK, root);
    validNode(root.left.left, 5, 5, NODE_COLORS.BLACK, root.left);
    validNode(root.left.right, 12, 12, NODE_COLORS.BLACK, root.left);
    validNode(root.right.left, 16, 16, NODE_COLORS.BLACK, root.right);
    validNode(root.right.right, 20, 20, NODE_COLORS.BLACK, root.right);
  });
});

describe('RBTree iterator test', () => {
  test('for...of test', () => {
    const tree = buildTree(...buildRandomNums());
    const nums: number[] = [];
    for (const [key, value] of tree) {
      expect(key).toBe(value);
      nums.push(value);
    }
    for (let i = 1; i < nums.length; i++) {
      expect(nums[i - 1]).toBeLessThan(nums[i]);
    }
  });

  test('toString test', () => {
    const tree = buildTree();
    expect(tree.toString()).toBe('{}');
  });

  test('tab test', () => {
    const tree = buildTree();
    expect(toString(tree)).toBe('[object RBTree]');
  });
});
