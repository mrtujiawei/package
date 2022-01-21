/**
 * 最小生成树
 * @filename packages/utils/src/data-structure/Graph/kruskal.ts
 * @author Mr Prince
 * @date 2023-02-09 11:49:30
 */

import UnionFind from '../UnionFind';

/**
 * Edge[0] 顶点1
 * Edge[1] 顶点2
 * Edge[2] 权重
 */
type Edge = number[];

/**
 * 求解最小生成树的代价
 * @param n 节点个数 [0, n - 1]
 * @param edges 边数
 * @returns 最小代价
 */
const kruskal = (n: number, edges: Edge[]) => {
  edges.sort((a, b) => a[2] - b[2]);

  const uf = new UnionFind(n);

  let result = 0;
  edges.forEach(([a, b, weight]) => {
    if (!uf.isBelongSameUnion(a, b)) {
      uf.union(a, b);
      result += weight;
    }
  });

  const target = uf.find(0);
  for (let i = 1; i < n; i++) {
    if (uf.find(i) != target) {
      return -1;
    }
  }

  return result;
};

export default kruskal;
