/**
 * Map操作增强
 * @filename: packages/utils/src/data-structure/MapEnhancer/MapEnhancer.ts
 * @author: Mr Prince
 * @date: 2022-10-14 14:06:43
 */

class MapEnhancer {
  /**
   * 对 key 对应的值，提升 value
   */
  static increase<T>(map: Map<T, number>, key: T, value: number = 1) {
    const newValue = (map.get(key) || 0) + value;
    map.set(key, newValue);
  }

  /**
   * 对 key 对应的值， 减少 value
   * 若减少后,值为0，则删除对应的key
   */
  static decrease<T>(map: Map<T, number>, key: T, value: number = 1) {
    const newValue = (map.get(key) || 0) - value;
    if (newValue == 0) {
      map.delete(key);
    } else {
      map.set(key, newValue);
    }
  }

  /**
   * 数组统计
   */
  static count<T>(values: T[]) {
    const counter = new Map<T, number>();

    values.forEach((value) => {
      MapEnhancer.increase(counter, value);
    });

    return counter;
  }

  /**
   * 没有值的时候用默认值
   */
  static getOrDefault<K, V>(map: Map<K, V>, key: K, defaultValue: V) {
    if (map.has(key)) {
      return map.get(key)!;
    }

    return defaultValue;
  }

  /**
   * 如果没有 key 时设置 value
   *
   * @returns 如果已存在，返回之前的值；否则返回新值
   */
  static setIfAbsent<K, V>(map: Map<K, V>, key: K, value: V) {
    const prevValue = map.get(key)!;
    if (map.has(key)) {
      return prevValue;
    }
    map.set(key, value);
    return prevValue;
  }

  /**
   * 如果有 set 过 key, 则 set 为新 value
   */
  static setIfPresent<K, V>(map: Map<K, V>, key: K, value: V) {
    const prevValue = map.get(key)!;
    if (map.has(key)) {
      map.set(key, value);
    }
    return prevValue;
  }

  /**
   * @returns map.size == 0
   */
  static isEmpty(map: Map<unknown, unknown>) {
    return map.size == 0;
  }

  /**
   * set all 如果已存在 key, value 会被 entries 中的覆盖
   */
  static setAll<K, V>(map: Map<K, V>, entries: Map<K, V>) {
    entries.forEach((value, key) => {
      map.set(key, value);
    });
  }

  /**
   * 替换指定 key 的 value
   *
   * @returns true if success, else false
   */
  static replace<K, V>(map: Map<K, V>, key: K, oldValue: V, newValue: V) {
    if (map.has(key) && map.get(key) == oldValue) {
      map.set(key, newValue);
      return true;
    }
    return false;
  }
}

export default MapEnhancer;
