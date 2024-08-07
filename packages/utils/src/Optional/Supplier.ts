/**
 *
 * @filename packages/utils/src/Optional/Supplier.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-08-07 17:10:40
 */

interface Supplier<T> {
  get(): T;
}

export default Supplier;
