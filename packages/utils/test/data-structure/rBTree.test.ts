import { RBTree, } from '../../src/index';

test('RBTree init test', () => {
  const tree = new RBTree<number, number>((a, b) => a - b);
  const nums = Array.from(
    {
      length: 100,
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
  console.log(result);
});
