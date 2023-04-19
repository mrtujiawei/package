/**
 * Dijkstra 最短路径算法
 * @filename packages/utils/src/data-structure/Graph/dijkstra.ts
 * @author Mr Prince
 * @date 2023-04-19 11:23:31
 */

import Heap from '../Heap';

/**
 * 求起始点到其他所有点的最短距离
 *
 * @param adjacent 邻接矩阵 adjacent[i][j]: 从 i 到 j 的距离为 adjacent[i][j]
 * @param start 起始点
 */
const dijkstra = (adjacent: number[][], start: number) => {
  const n = adjacent.length;
  const result: number[] = new Array(n).fill(Infinity);
  const nexts = new Heap<{ position: number; dist: number }>(
    (a, b) => a.dist - b.dist
  );

  nexts.insert({ position: start, dist: 0 });

  while (nexts.isNotEmpty()) {
    const node = nexts.remove();
    if (result[node.position] != Infinity) {
      continue;
    }
    result[node.position] = node.dist;
    adjacent[node.position].forEach((dist, position) => {
      result[position] != Infinity &&
        nexts.insert({ position, dist: dist + node.dist });
    });
  }

  return result;
};

export default dijkstra;
