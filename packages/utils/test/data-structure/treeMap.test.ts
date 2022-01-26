import { TreeMap } from '../../src/index';

test('TreeMap init test', () => {
  const treeMap = new TreeMap();

  const insertOrder: string[] = [];
  Array.from({ length: 26 }, (_, index) => String.fromCharCode(97 + index))
    .sort(() => (Math.random() > 0.5 ? 1 : -1))
    .forEach((value) => {
      treeMap.set(value, value);
      insertOrder.push(value);
    });

  const watchOrder: string[] = [];
  treeMap.forEach(value => {
    watchOrder.push(value);
  });

  console.log({
    insertOrder,
    watchOrder,
  });
});
