/**
 *
 * @filename packages/utils/src/url/index.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-07-04 17:25:58
 */

class URLUtils {
  public static hasProtocal(url: string) {
    return url.startsWith('http');
  }
}

export default URLUtils;
