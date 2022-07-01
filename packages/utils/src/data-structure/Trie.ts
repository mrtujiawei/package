/**
 * 前缀树
 * @filename: packages/utils/src/data-structure/Trie/Trie.ts
 * @author: Mr Prince
 * @date: 2022-06-29 16:49:59
 */

class Trie {
  /**
   * 是否是某个单词结尾
   */
  private end: boolean = false;

  /**
   * 末尾
   */
  private children = new Map<string, Trie>();

  /**
   * 搜索指定前缀的前缀树
   */
  private searchPrefix(prefix: string) {
    let node: Trie = this;
    for (const ch of prefix) {
      if (!node.children.has(ch)) {
        return false;
      }
      node = node.children.get(ch) as Trie;
    }
    return node.end;
  }

  insert(word: string) {
    let node: Trie = this;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new Trie());
      }
      node = node.children.get(ch) as Trie;
    }
    node.end = true;
  }

  /**
   * 是否存在
   */
  search(word: string): boolean {
    return this.searchPrefix(word);
  }

  /**
   * 前缀是否存在
   */
  startsWith(prefix: string): boolean {
    return this.searchPrefix(prefix);
  }
}

export default Trie;
