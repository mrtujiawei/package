/**
 * 插入排序最简版
 * @filename: insertSort.ts
 * @author: Mr Prince
 * @date: 2021-05-31 21:06:15
 */
function insertSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    let current = i;
    while (current > 0 && arr[current] < arr[current - 1]) {
      [arr[current], arr[current - 1]] = [arr[current - 1], arr[current]];
      current--;
    }
  }
  return arr;
}

export default insertSort;
