/**
 * LRUCache
 *
 * @filename packages/utils/src/Cache/LRUCache/index.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-03-28 16:52:44
 */

class LRUCache {
  private capacity: number;

  private misses = 0;
  private hits = 0;
  private cache = new Map();

  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity < 0) {
      throw new TypeError('Invalid capacity');
    }
    this.capacity = capacity;
  }

  get info() {
    return Object.freeze({
      misses: this.misses,
      hits: this.hits,
      capacity: this.capacity,
      size: this.getSize(),
    });
  }

  getSize() {
    return this.cache.size;
  }

  getCapacity() {
    return this.capacity;
  }

  setCapcaity(capacity: number) {
    if (capacity < 0) {
      throw new RangeError('Capacity should be greater than 0');
    }
    if (capacity < this.capacity) {
      let diff = this.capacity - capacity;

      while (diff--) {
        this.removeLeastRecentlyUsed();
      }
    }
    this.capacity = capacity;
  }

  private removeLeastRecentlyUsed() {
    this.cache.delete(this.cache.keys().next().value);
  }

  has(key: string) {
    return this.cache.has(key);
  }

  set(key: string, value: any) {
    if (this.getSize() === this.capacity) {
      this.removeLeastRecentlyUsed();
    }

    this.cache.set(key, value);
  }

  get(key: string) {
    // Returns the value for the input key. Returns null if key is not present in cache
    if (this.cache.has(key)) {
      const value = this.cache.get(key);

      // refresh the cache to update the order of key
      this.cache.delete(key);
      this.cache.set(key, value);

      this.hits++;
      return value;
    }

    this.misses++;
    return null;
  }

  parse(json: string) {
    const { misses, hits, cache } = JSON.parse(json);

    this.misses += misses ?? 0;
    this.hits += hits ?? 0;

    for (const key in cache) {
      this.set(key, cache[key]);
    }

    return this;
  }

  toString(indent: number) {
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

export default LRUCache;
