/**
 * 稀疏表
 *
 * 解决可重复贡献问题的数据结构
 *
 * 不支持修改操作
 *
 * @filename: packages/utils/src/data-structure/SparseTable/SparseTable.ts
 * @author: Mr Prince
 * @date: 2022-10-25 16:41:54
 */

class SparseTable {
  /**
   * 预先计算的结果
   */
  private table: number[][];

  /**
   * 快速计算
   */
  private lg: number[];

  /**
   * @param values - 需要查询的数据
   */
  constructor(values: number[]) {
    const lg = this.createLg(values.length);
    const table = this.preprocess(values, lg);
    this.lg = lg;
    this.table = table;
  }

  /**
   * 生成对数数组，查询时不需要每次计算对数
   */
  private createLg(n: number) {
    const lg: number[] = new Array(n + 1);
    lg[0] = -1;
    for (let i = 1; i <= n; i++) {
      lg[i] = lg[i >> 1] + 1;
    }
    return lg;
  }

  /**
   * 预处理
   * 两两相加递归
   * [a, b, c, d, e, f, g]
   * [ab, cd, ef, g]
   * [abcd, efg]
   * [abcdefg]
   */
  private preprocess(values: number[], lg: number[]) {
    const n = values.length;
    const table = Array.from({ length: n + 1 }, (_, index) => [
      values[index - 1],
    ]);

    table[0] = [];

    for (let j = 1; j <= lg[n]; j++) {
      for (let i = 1; i + (1 << j) - 1 <= n; i++) {
        table[i][j] = Math.max(
          table[i][j - 1],
          table[i + (1 << (j - 1))][j - 1]
        );
      }
    }

    return table;
  }

  /**
   * 区间查询结果
   *
   * 0 <= left <= right < values.length
   */
  query(left: number, right: number) {
    left++;
    right++;

    // 计算 2 ^ k <= right 的最大值
    const k = this.lg[right - left + 1];

    // 下标从1开始
    // left -> l = 2
    // right -> r = 6
    // k = 2
    // rl: 右侧区间的左边界
    //
    //     l  rl     k  r
    // [a, b, c, d, e, f, g]
    // table[l][k] -> [l, k] 之间的最大值
    // table[rl][k] -> [rl, r] 之间的最大值

    return Math.max(this.table[left][k], this.table[right - (1 << k) + 1][k]);
  }
}

export default SparseTable;
