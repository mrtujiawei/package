/**
 *
 * @filename packages/utils/src/Optional/Consumer.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-08-07 16:48:58
 */

import { requireNonNull } from '../utils/objectUtils';

class Consumer<T> {
  accept(_value: T) {}

  /**
   * @param after 原类型为 <? super T> ts 不支持
   */
  andThen(after: Consumer<T>) {
    requireNonNull(after);

    return new (class extends Consumer<T> {
      accept(value: T): void {
        this.accept(value);
        after.accept(value);
      }
    })();
  }
}

export default Consumer;
