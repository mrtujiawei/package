/**
 * 前缀和相关算法
 *
 * @filename packages/utils/src/utils/partialSumUtils.ts
 * @author Mr Prince
 * @date 2023-04-20 10:41:20
 */

/**
 * 部分和、前缀和
 */
export function partialSum(values: number[]) {
  if (values.length == 0) {
    return [0];
  }

  const result: number[] = new Array(values.length + 1);
  result[0] = 0;

  values.forEach((value, index) => {
    result[index + 1] = value + result[index];
  });

  return result;
}

/**
 * 二维部分和，二维前缀和
 * 基于容斥原理
 */
export function partialSum2(values: number[][]) {
  // 输入数据检查
  const m = values.length;
  if (m == 0) {
    return [];
  }
  const n = values[0].length;
  if (n == 0) {
    return Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  }

  const result: number[][] = Array.from(
    { length: m + 1 },
    () => new Array(n + 1)
  );
  result[0].fill(0);
  for (let i = 1; i <= m; i++) {
    result[i][0] = 0;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      result[i + 1][j + 1] =
        values[i][j] + result[i + 1][j] + result[i][j + 1] - result[i][j];
    }
  }

  return result;
}

/**
 * 三维部分和，三维前缀和
 * dp
 */
export function partialSum3(values: number[][][]) {
  const x = values.length;
  const y = values[0].length;
  const z = values[0][0].length;
  const result = Array.from({ length: x + 1 }, (_v, i) =>
    Array.from({ length: y + 1 }, (_v, j) =>
      Array.from({ length: z + 1 }, (_v, k) => {
        if (0 == i || 0 == j || k == 0) {
          return 0;
        }
        return values[i - 1][j - 1][k - 1];
      })
    )
  );

  for (let i = 1; i <= x; i++) {
    for (let j = 1; j <= y; j++) {
      for (let k = 1; k <= z; k++) {
        result[i][j][k] += result[i - 1][j][k];
      }
    }
  }

  for (let i = 1; i <= x; i++) {
    for (let j = 1; j <= y; j++) {
      for (let k = 1; k <= z; k++) {
        result[i][j][k] += result[i][j - 1][k];
      }
    }
  }

  for (let i = 1; i <= x; i++) {
    for (let j = 1; j <= y; j++) {
      for (let k = 1; k <= z; k++) {
        result[i][j][k] += result[i][j][k - 1];
      }
    }
  }

  return result;
}

/**
 * 一维数组的前缀和区间查询
 * @param values 前缀和数组，从0开始
 * @param left 左端点, 包含
 * @param right 右端点, 包含
 * @returns [left, right] 区间内数据的和
 */
export function partialSumQuery(values: number[], left: number, right: number) {
  // 校验逻辑
  if (
    left < 0 ||
    left >= values.length ||
    right < 0 ||
    right >= values.length
  ) {
    throw new RangeError(
      `left(${left}) or right(${right}) is not in range [0, ${
        values.length - 1
      }]`
    );
  }

  if (left > right) {
    throw new RangeError(`left(${left}) is bigger then right(${right})`);
  }

  return values[right + 1] - values[left];
}

/**
 * 二维数组的前缀和区间查询
 * @param values 前缀和数组，从0开始
 * @param top 上端点, 包含
 * @param left 左端点, 包含
 * @param bottom 下端点, 包含
 * @param right 右端点, 包含
 * @returns 左上顶点为[top, left] 右下顶点为[bottom, right] 的矩形范围内数据的和
 */
export function partialSum2Query(
  values: number[][],
  top: number,
  left: number,
  bottom: number,
  right: number
) {
  /**
   * 坐标检查
   */
  const checkPosition = (x: number, y: number) => {
    if (0 <= x && x < values.length && 0 <= y && y < values[x].length) {
      return;
    }
    throw new RangeError(`position [${x}, ${y}] is not valid`);
  };

  checkPosition(top, left);
  checkPosition(bottom, right);

  // 是否存在合理范围
  if (top > bottom || left > right) {
    throw new RangeError(`has no valid area`);
  }

  return (
    values[bottom + 1][right + 1] +
    values[top][left] -
    values[bottom + 1][left] -
    values[top][right + 1]
  );
}
