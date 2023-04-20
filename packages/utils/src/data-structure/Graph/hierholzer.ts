/**
 * Hierholzer算法 求解欧拉回路
 *
 * @filename packages/utils/src/data-structure/Graph/hierholzer.ts
 * @author Mr Prince
 * @date 2023-04-20 10:38:21
 */

/**
 * 需要 图 是欧拉图，顶点的度都是偶数
 *
 * (grid[x][y] == 0 || grid[x][y] == 1) == true 成立
 * grid[x][y] == 1 表示 x 有条到 y 的路径
 * grid[x][y] == 0 表示 x 没有到 y 的路径
 *
 * @param grid 邻接矩阵, 必须是欧拉图
 */
const hierholzer = (grid: number[][]) => {
  const path: number[] = [];

  const dfs = (x: number) => {
    for (let i = 0; i < grid[x].length; i++) {
      if (grid[x][i]) {
        grid[x][i]--;
        grid[i][x]--;
        dfs(i);
      }
    }
    path.push(x);
  };

  dfs(0);

  return path.reverse();
};

export default hierholzer;
