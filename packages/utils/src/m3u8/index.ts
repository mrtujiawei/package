/**
 *
 * @filename packages/utils/src/m3u8/index.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-07-04 17:21:03
 */

class M3u8FileUtils {
  /**
   * 判断是否是注释行
   */
  public static isCommentLine(line: string) {
    return line.trim().startsWith('#');
  }
}

export default M3u8FileUtils;
