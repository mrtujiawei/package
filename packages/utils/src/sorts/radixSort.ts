/**
 * 基数排序
 *
 * @filename: radixSort.js
 * @author: Mr Prince
 * @date: 2021-06-03 19:43:42
 */
function radixSort(arr: number[]): number[] {
  const RADIX = 10;

  let maxLength = false;
  let placement = 1;

  while (!maxLength) {
    maxLength = true;
    const buckets = Array.from<unknown, number[]>({ length: RADIX }, () => []);
    arr.forEach((item) => {
      const rdx = item / placement;
      buckets[Math.floor(rdx % RADIX)].push(item);
      if (maxLength && rdx > 0) {
        maxLength = false;
      }
    });

    let p = 0;
    for (let i = 0; i < RADIX; i++) {
      const bucket = buckets[i];
      bucket.forEach((value) => {
        arr[p++] = value;
      });
    }
    placement *= RADIX;
  }

  return arr;
}

export default radixSort;
