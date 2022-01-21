/**
 * 快排
 * @filename: quickSort.js
 * @author: Mr Prince
 * @date: 2021-05-29 21:10:48
 */
function quickSort(arr: number[]): number[] {
  function sort(start: number, end: number) {
    if (end - start < 2) {
      return;
    }
    const middle = getPivotIndex(start, end);

    sort(start, middle);
    sort(middle + 1, end);
  }

  function getPivotIndex(start: number, end: number): number {
    let randonIndex = Math.floor(Math.random() * (end - start)) + start;
    // 随机选择一个元素跟start交换一下
    // 备份轴点值
    let pivot = arr[randonIndex];
    arr[randonIndex] = arr[start];

    // end 指向最后一个元素
    end--;

    while (start < end) {
      // 相等的情况下甩到另一边
      // 为了尽量平均分割
      while (start < end) {
        if (arr[end] > pivot) {
          end--;
        } else {
          arr[start++] = arr[end];
          break;
        }
      }

      while (start < end) {
        if (arr[start] < pivot) {
          start++;
        } else {
          arr[end--] = arr[start];
          break;
        }
      }
    }

    arr[start] = pivot;
    return start;
  }

  sort(0, arr.length);

  return arr;
}

export default quickSort;
