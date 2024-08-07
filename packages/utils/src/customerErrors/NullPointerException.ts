/**
 * 空指针异常
 * @filename packages/utils/src/customerErrors/NullPointerException.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-08-07 15:39:03
 */

class NullPointerException extends Error {
  constructor(message?: string) {
    super(message)
  }
}

export default NullPointerException
