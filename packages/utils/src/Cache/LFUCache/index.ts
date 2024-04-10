/**
 * LFUCache
 *
 * Least Frequently Used
 *
 * @filename packages/utils/src/Cache/LFUCache/index.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-03-28 15:15:55
 */

import CacheNode from './CacheNode';
import FrequencyMap from './FrequencyMap';

class LFUCache {
  private frequencyMap = new FrequencyMap();

  private misses = 0;
  private hits = 0;
  private cache = new Map();

  constructor(private capacity: number) {}

  public getCapacity() {
    return this.capacity;
  }

  public getSize() {
    return this.cache.size;
  }

  public getLeastFrequency() {
    const freqCacheIterator = this.frequencyMap.keys();
    let leastFrequency = freqCacheIterator.next().value || null;

    while (this.frequencyMap.get(leastFrequency)?.size === 0) {
      leastFrequency = freqCacheIterator.next().value;
    }

    return leastFrequency;
  }

  public setCapacity(capacity: number) {
    if (this.capacity > capacity) {
      let diff = this.capacity - capacity;

      while (diff--) {
        this.removeCacheNode();
      }

      this.cache.size === 0 && this.frequencyMap.clear();
    }

    this.capacity = capacity;
  }

  public getInfo() {
    return {
      misses: this.misses,
      hits: this.hits,
      capacity: this.capacity,
      currentSize: this.getSize(),
      leastFrequency: this.getLeastFrequency(),
    };
  }

  private removeCacheNode() {
    const leastFreqSet = this.frequencyMap.get(this.getLeastFrequency())!;
    const LFUNode = leastFreqSet.values().next().value;

    leastFreqSet.delete(LFUNode);
    this.cache.delete(LFUNode.key);
  }

  public has(key: string) {
    return this.cache.has(key);
  }

  public getItem(key: string) {
    if (this.cache.has(key)) {
      const oldNode = this.cache.get(key);
      this.frequencyMap.refresh(oldNode);

      this.hits++;

      return oldNode.value;
    }

    this.misses++;

    return null;
  }

  public setItem(key: string, value: any, frequency: number = 1) {
    if (this.capacity === 0) {
      return;
    }

    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;

      this.frequencyMap.refresh(node);

      return this;
    }

    // if the cache size is full, then it's delete the Least Frequency Used node
    if (this.capacity === this.cache.size) {
      this.removeCacheNode();
    }

    const newNode = new CacheNode(key, value, frequency);

    this.cache.set(key, newNode);
    this.frequencyMap.insert(newNode);

    return this;
  }

  public parse(json: string) {
    const { misses, hits, cache } = JSON.parse(json);

    this.misses += misses ?? 0;
    this.hits += hits ?? 0;

    for (const key in cache) {
      const { value, frequency } = cache[key];
      this.setItem(key, value, frequency);
    }

    return this;
  }

  public clear() {
    this.cache.clear();
    this.frequencyMap.clear();

    return this;
  }

  public toString(indent: number) {
    return JSON.stringify(
      this,
      (_, value) => {
        if (value instanceof Set) {
          return [...value];
        }

        if (value instanceof Map) {
          return Object.fromEntries(value);
        }

        return value;
      },
      indent
    );
  }
}

export default LFUCache;
