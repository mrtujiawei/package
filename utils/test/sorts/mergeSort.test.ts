import { mergeSort, } from '../../src/sorts/index';

test('Merge sort test', () => {
  let originArr = [1, 3, 5, 7, 9, 2, 4, 6, 8, 10];
  let mergeSortedArr = mergeSort(originArr.slice());
  let sortedArr = originArr.slice().sort((a, b) => a - b);
  let allEqual = sortedArr.every((num, index) => {
    return num == mergeSortedArr[index];
  });
  expect(allEqual).toBe(true);
});
