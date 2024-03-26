/**
 * 线段树
 *
 * @filename packages/utils/src/data-structure/SegmentTreeNew/index.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-03-26 10:33:16
 */

import { isPowerOfTwo } from '../../utils';

class SegmentTree {
  segmentTree: any;
  constructor(
    private inputArray: number[],
    private operation: (a: number, b: number) => number,
    private operationFallback: number
  ) {
    this.segmentTree = this.initSegmentTree(this.inputArray);
    this.buildSegmentTree();
  }

  private initSegmentTree(inputArray: number[]) {
    let segmentTreeArrayLength: number;
    const inputArrayLength = inputArray.length;
    if (isPowerOfTwo(inputArrayLength)) {
      segmentTreeArrayLength = 2 * inputArrayLength - 1;
    } else {
      const currentPower = Math.floor(Math.log2(inputArrayLength));
      const nextPower = currentPower + 1;
      const nextPowerOfTwoNumber = 2 ** nextPower;
      segmentTreeArrayLength = 2 * nextPowerOfTwoNumber - 1;
    }

    return new Array(segmentTreeArrayLength).fill(null);
  }

  private buildSegmentTree() {
    const leftIndex = 0;
    const rightIndex = this.inputArray.length - 1;
    const position = 0;
    this.buildTreeRecursively(leftIndex, rightIndex, position);
  }

  private buildTreeRecursively(
    leftInputIndex: number,
    rightInputIndex: number,
    position: number
  ) {
    if (leftInputIndex === rightInputIndex) {
      this.segmentTree[position] = this.inputArray[leftInputIndex];
      return;
    }

    const middleIndex = Math.floor((leftInputIndex + rightInputIndex) / 2);
    this.buildTreeRecursively(
      leftInputIndex,
      middleIndex,
      this.getLeftChildIndex(position)
    );
    this.buildTreeRecursively(
      middleIndex + 1,
      rightInputIndex,
      this.getRightChildIndex(position)
    );

    this.segmentTree[position] = this.operation(
      this.segmentTree[this.getLeftChildIndex(position)],
      this.segmentTree[this.getRightChildIndex(position)]
    );
  }

  private getLeftChildIndex(parentIndex: number) {
    return 2 * parentIndex + 1;
  }

  private getRightChildIndex(parentIndex: number) {
    return 2 * parentIndex + 2;
  }

  public rangeQuery(queryLeftIndex: number, queryRightIndex: number) {
    const leftIndex = 0;
    const rightIndex = this.inputArray.length - 1;
    const position = 0;
    return this.rangeQueryRecursive(
      queryLeftIndex,
      queryRightIndex,
      leftIndex,
      rightIndex,
      position
    );
  }

  private rangeQueryRecursive(
    queryLeftIndex: number,
    queryRightIndex: number,
    leftIndex: number,
    rightIndex: number,
    position: number
  ): number {
    // 全覆盖
    if (queryLeftIndex <= leftIndex && queryRightIndex >= rightIndex) {
      return this.segmentTree[position];
    }

    // 没找到
    if (queryLeftIndex > rightIndex || queryRightIndex < leftIndex) {
      return this.operationFallback;
    }

    // 部分覆盖
    const middleIndex = Math.floor((leftIndex + rightIndex) / 2);

    const leftOperationResult = this.rangeQueryRecursive(
      queryLeftIndex,
      queryRightIndex,
      leftIndex,
      middleIndex,
      this.getLeftChildIndex(position)
    );
    const rightOperationResult = this.rangeQueryRecursive(
      queryLeftIndex,
      queryRightIndex,
      middleIndex + 1,
      rightIndex,
      this.getRightChildIndex(position)
    );

    return this.operation(leftOperationResult, rightOperationResult);
  }
}

export default SegmentTree;
