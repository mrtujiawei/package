import { shellSort, } from '../../src/sorts/index';

test('Shell sort test', () => {
  let arr: number[] = [];
  for (let i = 0; i < 32; i++) {
    arr.push(Math.floor(100 * i));
  }
  arr = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  shellSort(arr);
});
