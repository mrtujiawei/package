import { quickSort, } from '../../src/sorts/index';

test('Quick sort test', () => {
  let arr = [1, 3, 5, 7, 9, 2, 4, 6, 8, 10];
  quickSort(arr);
  console.log(arr.toString());
});
