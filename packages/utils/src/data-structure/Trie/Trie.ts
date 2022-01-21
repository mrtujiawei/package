/**
 * 前缀树
 * @filename: packages/utils/src/data-structure/Trie/Trie.ts
 * @author: Mr Prince
 * @date: 2022-06-29 16:49:59
 */
import TrieNode from './TrieNode';

class Trie {
  private root = new TrieNode();

  private wordCount = 0;

  /**
   * 字典树中有多少个单词
   */
  getWordCount() {
    return this.wordCount;
  }

  /**
   * 插入单词
   */
  insert(word: string) {
    let node: TrieNode = this.root;
    for (const ch of word) {
      node.increaseIncludeCount();
      if (!node.hasChild(ch)) {
        node.addChild(ch);
      }
      node = node.getChild(ch);
    }
    node.increaseIncludeCount();
    node.increaseEndCount();
    this.wordCount++;
  }

  /**
   * 搜索指定前缀的最后一个节点
   */
  private searchPrefixNode(prefix: string) {
    let node: TrieNode = this.root;
    for (const ch of prefix) {
      if (!node.hasChild(ch)) {
        return null;
      }
      node = node.getChild(ch);
    }
    return node;
  }

  /**
   * 是否存在
   */
  search(word: string): boolean {
    const node = this.searchPrefixNode(word);
    if (null == node) {
      return false;
    }
    return node.isEndOfWord();
  }

  /**
   * 前缀是否存在
   */
  startsWith(prefix: string): boolean {
    const node = this.searchPrefixNode(prefix);
    if (null == node) {
      return false;
    }
    return node.hasIncludeWords();
  }

  /**
   * 移除
   */
  remove(word: string): boolean {
    const stack: TrieNode[] = [];
    let node = this.root;
    for (const ch of word) {
      if (!node.hasChild(ch)) {
        return false;
      }
      stack.push(node);
      node = node.getChild(ch);
    }
    if (!node.isEndOfWord()) {
      return false;
    }
    stack.push(node);

    for (let i = 0; i < stack.length; i++) {
      const node = stack[i];
      node.decreaseIncludeCount();
      if (node.tryDeleteChild(word[i])) {
        break;
      }
    }

    this.wordCount--;
    return true;
  }

  /**
   * 不保证遍历的顺序
   */
  forEach(callback: (word: string) => void) {
    this.forEachImpl(this.root, '', callback);
  }

  private forEachImpl(
    node: TrieNode,
    prefix: string,
    callback: (word: string) => void
  ) {
    if (node.isEndOfWord()) {
      for (let i = 0; i < node.getEndCount(); i++) {
        callback(prefix);
      }
    }
    if (node.isLeaf()) {
      return;
    }
    node.getChildren().forEach((child, ch) => {
      this.forEachImpl(child, prefix + ch, callback);
    });
  }

  /**
   * 转换成数组
   */
  toArray() {
    const result: string[] = [];
    this.forEach((word) => {
      result.push(word);
    });
    return result;
  }

  /**
   * 清空字典树
   */
  clear() {
    this.root = new TrieNode();
    this.wordCount = 0;
  }

  /**
   * 将数组转换成字典树
   */
  static fromArray(words: string[]) {
    const trie = new Trie();
    words.forEach((word) => trie.insert(word));
    return trie;
  }
}

export default Trie;
