/**
 * 桶排序
 * @filename: countingSort.ts
 * @author: Mr Prince
 * @date: 2021-06-01 20:19:48
 */
function countingSort(arr: number[]): number[] {
  if (arr.length < 2) {
    return arr;
  }

  function getRange() {
    let min = arr[0];
    let max = arr[0];

    arr.forEach((value) => {
      if (min > value) {
        min = value;
      }
      if (max < value) {
        max = value;
      }
    });
    return [min, max];
  }

  let [min, max] = getRange();

  let counting = new Array(max - min + 1).fill(0);

  arr.forEach((value) => {
    counting[value - min]++;
  });

  let pos = 0;
  counting.forEach((count, index) => {
    let value = min + index;
    while (count-- > 0) {
      arr[pos++] = value;
    }
  });

  return arr;
}

export default countingSort;
