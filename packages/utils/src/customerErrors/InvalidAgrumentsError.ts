/**
 * 参数错误
 *
 * @filename packages/utils/src/customerErrors/InvalidAgrumentsError.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-07-04 17:03:26
 */

class InvalidAgrumentsError extends Error {
  constructor(message = 'Invalid Arguments') {
    super(message);
  }
}

export default InvalidAgrumentsError;
