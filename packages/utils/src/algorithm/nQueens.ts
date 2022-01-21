/**
 * n 皇后问题 研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。
 * 给你一个整数 n ，返回 n 皇后问题 不同的解决方案的数量。
 * 1 <= n <= 9
 * 皇后彼此不能相互攻击，也就是说：任何两个皇后都不能处于同一条横行、纵行或斜线上。
 */
var totalNQueens = function (n: number) {
  let counts = new Array(n);
  for (let i = 0; i < n; i++) {
    counts[i] = new Array(n).fill(0);
  }

  let result = 0;

  function backtrack(row: number) {
    if (n == row) {
      result++;
      return;
    }
    for (let i = 0; i < n; i++) {
      if (0 != counts[row][i]) {
        continue;
      }
      changeCounts(row, i, 1);
      backtrack(row + 1);
      changeCounts(row, i, -1);
    }
  }

  function changeCounts(row: number, col: number, change: number) {
    for (let i = 0; i < n; i++) {
      counts[row][i] += change;
      counts[i][col] += change;
      if (checkIndex(row - i) && checkIndex(col - i)) {
        counts[row - i][col - i] += change;
      }
      if (checkIndex(row - i) && checkIndex(col + i)) {
        counts[row - i][col + i] += change;
      }
      if (checkIndex(row + i) && checkIndex(col - i)) {
        counts[row + i][col - i] += change;
      }
      if (checkIndex(row + i) && checkIndex(col + i)) {
        counts[row + i][col + i] += change;
      }
    }
  }

  function checkIndex(index: number) {
    return 0 <= index && index < n;
  }

  backtrack(0);

  return result;
};
