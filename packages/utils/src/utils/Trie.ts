/**
 * 前缀树
 * @filename: src/utils/Trie.ts
 * @author: Mr Prince
 * @date: 2021-11-21 18:08:25
 */

class Trie {
  private children: any = {
    isEnd: false,
  };

  /**
   * 搜索指定前缀的前缀树
   */
  private searchPrefix(prefix: string) {
    let node = this.children;
    for (const ch of prefix) {
      if (!node[ch]) {
        return false;
      }
      node = node[ch];
    }
    return node;
  }

  insert(word: string): void {
    let node = this.children;
    for (const ch of word) {
      if (!node[ch]) {
        node[ch] = {};
      }
      node = node[ch];
    }
    node.isEnd = true;
  }

  /**
   * 是否存在
   */
  search(word: string): boolean {
    const node = this.searchPrefix(word);
    return node && node.isEnd;
  }

  /**
   * 前缀是否存在
   */
  startsWith(prefix: string): boolean {
    return this.searchPrefix(prefix);
  }
}

export default Trie;
