/**
 * 希尔排序
 * @filename: shellSort.ts
 * @author: Mr Prince
 * @date: 2021-05-31 12:10:54
 */
function shellSort(arr: number[]) {
  let stepSequence: number[] = [];

  function createStepSequence() {
    stepSequence = [];
    let step = arr.length;

    while (step > 1) {
      step >>= 1;
      stepSequence.push(step);
    }
    // 最好的步长序列 O(n^(4 / 3))
    // if (k == even) {
    //   9 * (2 ^ k - 2 ^ ( k / 2 )) + 1
    // } else {
    //   8 * 2 ^ k - 6 * 2 ^((k + 1) / 2) + 1
    // }
    // 1, 5, 19, 41, 109
  }

  /**
   * 分成step列进行排序
   */
  function sort(step: number) {
    for (let col = 0; col < step; col++) {
      insertSort(col, step);
    }
  }

  function insertSort(start: number, step: number) {
    for (let i = start + step; i < arr.length; i += step) {
      let current = i;
      while (current > start && arr[current] < arr[current - step]) {
        [arr[current], arr[current - step]] = [
          arr[current - step],
          arr[current],
        ];
        current -= step;
      }
    }
    console.log(
      `insertSort(start = ${start}, step = ${step}) => [${arr.join(', ')}]`
    );
  }

  createStepSequence();
  stepSequence.forEach((step) => {
    sort(step);
  });
  return arr;
}

export default shellSort;
