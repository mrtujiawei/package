/**
 * 缓存节点
 *
 * @filename packages/utils/src/Cache/LRUCache/CacheNode.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-03-28 15:28:54
 */

class CacheNode<K, V> {
  constructor(private key: K, private value: V, private frequency: number) {}

  public getKey() {
    return this.key;
  }

  public getValue() {
    return this.value;
  }

  public getFrequency() {
    return this.frequency;
  }

  public updateFrequency(frequency: number) {
    this.frequency = frequency;
  }

  public increaseFrequency(count: number = 1) {
    this.frequency += count;
  }
}

export default CacheNode;
