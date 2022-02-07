import { RBTree, } from '../../src/index';

/**
 * 验证是否满足二叉搜索树的性质
 */
test('RBTree should statistify binary tree', () => {
  const size = 1000;
  const tree = new RBTree<number, number>((a, b) => a - b);
  const nums = Array.from(
    {
      length: size,
    },
    (_, index) => 1 + index
  ).sort(() => (Math.random() < 0.5 ? 1 : -1));

  nums.forEach(num => {
    tree.insertMultiple(num, num);
  });

  const result: number[] = [];
  tree.forEach((key, value) => {
    if (key != value) {
      console.warn('数据有误');
    }
    result.push(key);
  });
  expect(size).toBe(result.length);
  for (let i = 1; i < size; i++) {
    expect(result[i - 1]).toBeLessThan(result[i]);
  }
});
