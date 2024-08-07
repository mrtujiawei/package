/**
 *
 * @filename packages/utils/src/Optional/Predicate.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-08-07 16:52:47
 */

interface Predicate<T> {
  test(value: T): boolean;
}

export default Predicate;
