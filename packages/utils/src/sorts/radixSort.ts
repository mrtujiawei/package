/**
 * 基数排序,没写完
 * @filename: radixSort.js
 * @author: Mr Prince
 * @date: 2021-06-03 19:43:42
 */
function radixSort(arr: number[]): number[] {
  let max: number;

  function getMax(): number {
    max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (max < arr[i]) {
        max = arr[i];
      }
    }
    return max;
  }

  function countSort(divider: number) {
    let counting = new Array(10).fill(0);

    arr.forEach((value) => {
      let cur = value / divider;
      console.log(cur);
    });

    console.log(counting);
  }

  if (arr.length < 2) {
    return arr;
  }

  max = getMax();

  countSort(1);
  return arr;
}

export default radixSort;
