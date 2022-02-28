function heapSort(arr: number[]) {
  let heapSize = arr.length;

  // 原地建堆
  function buildHeap() {
    for (let i = (heapSize >> 1) - 1; i >= 0; i--) {
      shiftDown(i);
    }
  }

  // 下沉操作调整堆
  function shiftDown(index: number) {
    let value = arr[index];

    let half = heapSize >> 1;
    while (index < half) {
      let childIndex = (index << 1) + 1;
      let child = arr[childIndex];

      let rightIndex = childIndex + 1;

      // 右子节点比左子节点大
      if (rightIndex < heapSize && arr[rightIndex] > child) {
        child = arr[rightIndex];
        childIndex = rightIndex;
      } else if (value >= child) {
        break;
      }

      arr[index] = child;
      index = childIndex;
    }
    arr[index] = value;
  }

  function sort() {
    buildHeap();
    while (1 < heapSize) {
      // 把最大值放到最后
      [arr[0], arr[heapSize - 1]] = [arr[heapSize - 1], arr[0]];
      heapSize--;
      // 调整成为大顶堆
      shiftDown(0);
    }
  }

  sort();

  return arr;
}

export default heapSort;
