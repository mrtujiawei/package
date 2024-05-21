/**
 * 有向图单源最短路径 支持负权边
 *
 * 复杂度太高
 *
 * @filename packages/utils/src/data-structure/Graph/bellmanFord.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-05-21 19:12:32
 */

export const bellmanFord = (graph: number[][], startVertex: number) => {
  const distances: Record<string, number> = {};
  const previousVertices: Record<string, any> = {};

  distances[startVertex] = 0;
  graph[startVertex].forEach((_value, index) => {
    previousVertices[index] = null;
    if (index !== startVertex) {
      distances[index] = Infinity;
    }
  });

  for (let i = 1; i < graph.length; i++) {
    // 遍历所有顶点
    graph.forEach((_, vertex) => {
      // 遍历所有边
      graph[vertex].forEach((edge, neighbor) => {
        const distanceToVertex = distances[vertex];
        const distanceToNeighbor = distanceToVertex + edge;
        if (distanceToNeighbor < distances[neighbor]) {
          distances[neighbor] = distanceToNeighbor;
          previousVertices[neighbor] = vertex;
        }
      });
    });
  }

  return {
    distances,
    previousVertices,
  };
};
