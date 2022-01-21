/**
 * kruskal 测试
 * @filename packages/utils/tests/data-structure/kruskal.test.ts
 * @author Mr Prince
 * @date 2023-02-09 13:42:08
 */

import { kruskal } from '../../src';

describe('kruskal test', () => {
  test('kruskal test', () => {
    const result = kruskal(5, [
      [0, 1, 2],
      [0, 2, 1],
      [1, 2, 3],
      [1, 3, 4],
      [3, 4, 6],
      [2, 4, 5],
    ]);

    expect(result).toBe(12);
  });
});
