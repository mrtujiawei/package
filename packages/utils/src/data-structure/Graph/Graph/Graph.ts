import DirectedGraph from "../DirectedGraph";

/**
 * @public
 */
class Graph<K, V> extends DirectedGraph<K, V> {
  /**
   * 移除节点的所有边
   */
  removeEdges(key: K) {
    if (!this.hasVertex(key)) {
      return 0;
    }
    let removeEdgesCount = 0;
    this.edges.get(key)!.forEach((_weight, destKey) => {
      this.removeEdge(destKey, key);
      removeEdgesCount++;
    });
    removeEdgesCount += this.edges.get(key)!.size;
    this.edges.set(key, new Map());
    return removeEdgesCount ;
  }

  /**
   * 添加边
   */
  addEdge(srcKey: K, destKey: K, weight: number): void {
    super.addEdge(srcKey, destKey, weight);
    super.addEdge(destKey, srcKey, weight);
  }

  /**
   * 移除边
   */
  removeEdge(srcKey: K, destKey: K): boolean {
    return super.removeEdge(srcKey, destKey) && super.removeEdge(destKey, srcKey);
  }

  /**
   * 获得边数
   * 因为是无向图，边数要 / 2
   */
  getEdgesCount(): number {
    return this.getEdgesCount() / 2;
  }
}

export default Graph;
