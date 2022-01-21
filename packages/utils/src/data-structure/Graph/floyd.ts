/**
 * floyd 算法
 * 多源最短路径
 * @filename: packages/utils/src/data-structure/Graph/floyd.ts
 * @author: Mr Prince
 * @date: 2022-10-19 17:34:35
 */

/**
 * 对于其中未连通的节点，需填充一个极大值
 *
 * @public
 *
 * @param adjacent 邻接矩阵 adjacent.length == adjacent[0].length
 */
const floyd = (adjacent: number[][]) => {
  for (let k = 0; k < adjacent.length; k++) {
    for (let i = 0; i < adjacent.length; i++) {
      for (let j = 0; j < adjacent.length; j++) {
        const len = adjacent[i][k] + adjacent[k][j];
        if (len < adjacent[i][j]) {
          adjacent[i][j] = len;
        }
      }
    }
  }
};

export default floyd;
