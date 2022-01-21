import { insertSort, } from '../../src/sorts/index';

test('Insert sort test', () => {
  let arr = insertSort([1, 3, 5, 7, 9, 2, 4, 6, 8, 10, 0]);
  console.log(arr);
});
