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
}

export default MapEnhancer;
