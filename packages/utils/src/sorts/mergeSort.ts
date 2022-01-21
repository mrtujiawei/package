/**
 * 归并排序
 * @filename: MergeSort.js
 * @author: Mr Prince
 * @date: 2021-05-28 21:10:48
 */

function mergeSort(arr: number[]): number[] {
  let tempArr = new Array(arr.length >> 1);

  function sort(start: number, end: number): void {
    let dist = end - start;
    if (1 >= dist) {
      return;
    }

    let middle = (start + end) >> 1;

    sort(start, middle);
    sort(middle, end);
    merge(start, middle, end);
  }

  function merge(start: number, middle: number, end: number): void {
    const copyLength = middle - start;
    for (let i = 0; i < copyLength; i++) {
      tempArr[i] = arr[start + i];
    }

    let posLeft = start;
    let posRight = middle;

    for (let i = start; i < end; i++) {
      if (posLeft < middle && posRight < end) {
        if (tempArr[posLeft - start] <= arr[posRight]) {
          arr[i] = tempArr[posLeft - start];
          posLeft++;
        } else {
          arr[i] = arr[posRight++];
        }
      } else if (posLeft < middle) {
        arr[i] = tempArr[posLeft - start];
        posLeft++;
      } else {
        break;
      }
    }
  }

  sort(0, arr.length);
  return arr;
}

export default mergeSort;
