/**
 *
 * @filename packages/utils/src/VirtualScroll/index.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2025-09-10 10:10:41
 */

import { Key } from '../types';

type GetItemKey<T> = (item: T) => Key;

type Options<T> = {
  /**
   * 滚动容器高度
   */
  containerHeight: number;

  /**
   * 记录高度需要
   */
  getItemKey: (item: T) => Key;

  /**
   * 默认高度 与实际高度可能不同
   */
  defaultItemHeight: number;

  /**
   * 屏幕外至少保留 threshold px 内容
   */
  threshold?: number;
};

class VirtualScroll<Data> {
  private containerHeight: number;
  private defaultItemHeight: number;
  private getItemKey: GetItemKey<Data>;
  private threshold: number;

  private items: Data[] = [];

  private heights = new Map<Key, number>();

  constructor(options: Options<Data>) {
    this.containerHeight = options.containerHeight;
    this.defaultItemHeight = options.defaultItemHeight;
    this.getItemKey = options.getItemKey;
    this.threshold = options.threshold || 0;
  }

  onScroll(scrollTop: number) {
    let h = Math.max(scrollTop - this.threshold, 0);
    let pos = 0;

    // 顶部隐藏的内容
    let paddingTop = 0;
    for (; h > 0; pos++) {
      const height = this.getItemHeight(this.items[pos]);
      paddingTop += height;
      h -= height;
    }

    h += this.containerHeight + this.threshold;

    let startIndex = pos;

    // 中间显示的内容
    for (; h > 0; pos++) {}

    let endIndex = pos;

    // 底部隐藏的内容
    let paddingBottom = 0;

    while (pos < this.items.length) {
      paddingBottom += this.getItemHeight(this.items[pos++]);
    }

    return {
      paddingTop,
      paddingBottom,
      renderItems: this.items.slice(startIndex, endIndex),
    };
  }

  updateItems(items: Data[]) {
    this.items = items;
  }

  updateContainerHeight(height: number) {
    this.containerHeight = height;
  }

  updateItemHeight(item: Data, height: number) {
    const key = this.getItemKey(item);
    this.heights.set(key, height);
  }

  clear() {
    this.heights.clear();
  }

  private getItemHeight(item: Data) {
    const key = this.getItemKey(item);
    return this.heights.get(key) || this.defaultItemHeight;
  }
}

export default VirtualScroll;
