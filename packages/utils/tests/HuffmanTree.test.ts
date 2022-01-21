import { HuffmanTree } from '../src';

/**
 * HuffmanTree 测试
 * @filename packages/utils/tests/HuffmanTree.test.ts
 * @author Mr Prince
 * @date 2023-02-09 10:39:01
 */
describe('HuffmanTree', () => {
  test('encode test', () => {
    const origin = 'aaabbccccc';
    const tree = new HuffmanTree(origin);
    const target = tree.encode();
    expect(tree.decode(target)).toBe(origin);
  });
});
