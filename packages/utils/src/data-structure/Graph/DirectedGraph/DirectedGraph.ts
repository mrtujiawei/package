/**
 * 有向图
 * @filename: src/data-structure/Graph/DirectedGraph/DirectedGraph.ts
 * @author: Mr Prince
 * @date: 2022-07-01 15:45:50
 */
import Queue from '../../Queue/Queue';

// TODO
// 只实现了最简单的一些功能，可以加入一下算法？迪克斯特拉, floyd

/**
 * @public
 */
class DirectedGraph<K, V> {
  /**
   * 节点不存在错误
   */
  static VertexNotExistError = class extends Error {};

  /**
   * 边不存在错误
   */
  static EdgeNotExistError = class extends Error {};

  /**
   * 顶点
   */
  private vertices = new Map<K, V>();

  /**
   * 边
   */
  protected edges = new Map<K, Map<K, number>>();

  /**
   * 边数
   */
  private edgesCount = 0;

  /**
   * 获取节点数
   */
  getEdgesCount() {
    return this.edgesCount;
  }

  /**
   * 获取定点数
   */
  getVerticesCount() {
    return this.vertices.size;
  }

  /**
   * 添加顶点 并 添加记录边的map
   */
  addVertex(key: K, value: V) {
    this.vertices.set(key, value);
    if (!this.edges.has(key)) {
      this.edges.set(key, new Map());
    }
  }

  /**
   * 在 srcKey 和 destKey 之间，添加一条边
   * 如果边已经存在，则更新权重
   */
  addEdge(srcKey: K, destKey: K, weight: number) {
    this.checkVertexExist(srcKey);
    this.checkVertexExist(destKey);
    const srcVertex = this.edges.get(srcKey)!;
    if (srcVertex.has(destKey)) {
      this.edgesCount++;
    }
    srcVertex.set(destKey, weight);
  }

  /**
   * 是否存在顶点 key
   */
  hasVertex(key: K) {
    return this.vertices.has(key);
  }

  /**
   * 是否有一条从 srcKey 到 destKey 的边
   */
  hasEdge(srcKey: K, destKey: K) {
    return this.hasVertex(srcKey) && this.hasVertex(destKey) && this.edges.get(srcKey)!.has(destKey);
  }

  getWeight(srcKey: K, destKey: K) {
    if (this.hasVertex(srcKey) && srcKey == destKey) {
      return 0;
    }

    if (!this.hasEdge(srcKey, destKey)) {
      return Infinity;
    }

    return this.edges.get(srcKey)!.get(destKey);
  }

  /**
   * 移除顶点
   */
  removeVertex(key: K) {
    if (!this.vertices.has(key)) {
      return false;
    }
    this.removeEdges(key);
    this.edges.delete(key);
    this.vertices.delete(key);
    return true;
  }

  /**
   * 删除边
   */
  removeEdge(srcKey: K, destKey: K) {
    if (!this.hasEdge(srcKey, destKey)) {
      return false;
    }
    this.edges.get(srcKey)!.delete(destKey);
    this.edgesCount--;
    return true;
  }

  /**
   * 移除和当前key有关的所有边
   * @returns 本删除的边数
   */
  removeEdges(key: K) {
    if (!this.hasVertex(key)) {
      return 0;
    }
    let removeEdgesCount = 0;
    this.edges.forEach((edge, srcKey) => {
      if (edge.has(key)) {
        this.removeEdge(srcKey, key);
        removeEdgesCount++;
      }
    });

    const currentEdgesCount = this.edges.get(key)!.size;
    removeEdgesCount += currentEdgesCount;
    this.edgesCount -= currentEdgesCount;
    this.edges.set(key, new Map());
    return removeEdgesCount;
  }

  /**
   * 清空有向图
   */
  clear() {
    this.vertices.clear();
    this.edges.clear();
  }

  /**
   * 深度优先遍历
   */
  traverseDfs(srcKey: K, callback: (key: K, value: V) => void) {
    this.traverseDfsimpl(srcKey, callback, new Set());
  }

  /**
   * 深度优先遍历实现
   */
  private traverseDfsimpl(srcKey: K, callback: (key: K, value: V) => void, visited: Set<K>) {
    if (!this.hasVertex(srcKey) || visited.has(srcKey)) {
      return;
    }
    callback(srcKey, this.vertices.get(srcKey)!);
    visited.add(srcKey);
    this.edges.get(srcKey)!.forEach((_weight, destKey) => {
      this.traverseDfsimpl(destKey, callback, visited)
    });
  }

  /**
   * 广度优先遍历
   */
  traverseBfs(srcKey: K, callback: (key: K, value: V) => void) {
    if (!this.hasVertex(srcKey)) {
      return;
    }

    const queue = new Queue<K>();
    queue.enqueue(srcKey);
    const visited = new Set([srcKey]);

    while (!queue.isEmpty()) {
      const nextKey = queue.dequeue();
      callback(nextKey, this.vertices.get(nextKey)!);
      this.edges.get(nextKey)!.forEach((_weight, destKey) => {
        if (!visited.has(destKey)) {
          queue.enqueue(destKey);
          visited.add(destKey);
        }
      });
    }
  }

  /**
   * 检查节点是否存在
   */
  private checkVertexExist(key: K) {
    if (!this.vertices.has(key)) {
      throw new DirectedGraph.VertexNotExistError(`Vertex ${key} is not exists`);
    }
  }
}

export default DirectedGraph;
