/**
 * 珠排序
 * @filename packages/utils/src/sorts/beadSort.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-04-30 10:09:31
 */

const beadSort = (arr: number[]) => {
  if (arr.some((integer) => integer < 0)) {
    throw TypeError('Arr must be a list of Positive integers Only!');
  }

  const BEAD = '*';
  const EMPTY = '';

  const arrLength = arr.length;
  const max = Math.max(...arr);

  // 串珠子
  const grid = arr.map((number) => {
    const maxArr = new Array<string>(max);

    for (let i = 0; i < number; i++) {
      maxArr[i] = BEAD;
    }

    return maxArr;
  });

  // 下落
  for (let j = 0; j < max; j++) {
    let beadsCount = 0;

    for (let row = 0; row < arrLength; row++) {
      if (grid[row][j] === '*') {
        beadsCount++;
      }
    }

    for (let row = arrLength - 1; row >= 0; row--) {
      if (beadsCount) {
        grid[row][j] = BEAD;
        beadsCount--;
      } else {
        grid[row][j] = EMPTY;
      }
    }
  }

  return grid.map(
    (beadArray) => beadArray.filter((bead) => bead == BEAD).length
  );
};

export default beadSort;
