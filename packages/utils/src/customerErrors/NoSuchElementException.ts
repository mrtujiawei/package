/**
 *
 * @filename packages/utils/src/customerErrors/NoSuchElementException.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-08-07 15:54:13
 */

class NoSuchElementException extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export default NoSuchElementException;
