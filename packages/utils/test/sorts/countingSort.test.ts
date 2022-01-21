import { countingSort } from '../../src/sorts/index';

test('Count sort test', () => {
  let arr = [
    1, 3, 5, 7, 9, 2, 4, 6, 8, 10,
    1, 3, 5, 7, 9, 2, 4, 6, 8, 10,
    1, 3, 5, 7, 9, 2, 4, 6, 8, 10,
    2, 3, 4, 2, 3, 4, 2, 3, 4, 3
  ];
  countingSort(arr);
  console.log(arr);
});
