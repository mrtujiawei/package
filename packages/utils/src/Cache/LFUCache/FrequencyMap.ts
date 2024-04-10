/**
 * Map 扩展
 * @filename packages/utils/src/Cache/LRUCache/FrequencyMap.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-03-28 15:41:07
 */

import CacheNode from './CacheNode';

type CN = CacheNode<any, any>;
type V = Set<CN>;

class FrequencyMap extends Map<number, V> {
  static get [Symbol.species]() {
    return Map;
  }

  get [Symbol.toStringTag]() {
    return 'FrequencyMap';
  }

  /**
   * 刷新节点Node
   */
  refresh(node: CN) {
    const frequency = node.getFrequency();
    const freqSet = this.get(frequency)!;
    freqSet.delete(node);
    node.increaseFrequency();
    this.insert(node);
  }

  /**
   * 插入新节点
   */
  insert(node: CN) {
    const frequency = node.getFrequency();
    if (!this.has(frequency)) {
      this.set(frequency, new Set<CN>());
    }
    this.get(frequency)!.add(node);
  }
}

export default FrequencyMap;
