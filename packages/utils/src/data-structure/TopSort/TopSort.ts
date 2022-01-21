/**
 * 拓扑排序
 * @filename packages/utils/src/data-structure/TopSort/TopSort.ts
 * @author Mr Prince
 * @date 2023-02-09 11:31:34
 */

class TopSort {
  /**
   * 根据邻接表排序
   * @param adjacencyList 不能有重复的边
   */
  sortByAdjacencyList(adjacencyList: number[][]) {
    const nodes: number[] = [];
    const indegree: number[] = adjacencyList.map((nexts, node) => {
      const count = nexts.length;
      if (count == 0) {
        nodes.push(node);
      }
      return count;
    });

    const result: number[] = [];
    while (nodes.length > 0) {
      const node = nodes.pop()!;
      result.push(node);
      adjacencyList[node].forEach((next) => {
        indegree[next]--;
        if (indegree[next] == 0) {
          nodes.push(next);
        }
      });
    }

    if (result.length != adjacencyList.length) {
      throw new Error('has circle');
    }

    return result;
  }

  /**
   * 根据边排序
   * @param nodeCount 节点个数， 范围 [0, n - 1]
   * @param edges 每一项 [a, b] 表示 从 a 到 b 有一条路径可以到，不能有重复边
   */
  sortByEdges(nodeCount: number, edges: number[][]) {
    const adjacencyList: number[][] = Array.from(
      { length: nodeCount },
      () => []
    );
    edges.forEach(([a, b]) => {
      adjacencyList[a].push(b);
    });
    return this.sortByAdjacencyList(adjacencyList);
  }
}

export default TopSort;
