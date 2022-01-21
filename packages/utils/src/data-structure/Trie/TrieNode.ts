/**
 * 节点
 * @filename: src/data-structure/Trie/TrieNode.ts
 * @author: Mr Prince
 * @date: 2022-06-29 16:52:38
 */
class TrieNode {
  /**
   * 单词中包含改字符的个数
   */
  private includeCount = 0;

  /**
   * 以当前字符结尾的字符串个数
   */
  private endCount = 0;

  /**
   * 子节点
   */
  private children = new Map<string, TrieNode>();

  getEndCount() {
    return this.endCount;
  }

  isLeaf() {
    return 0 == this.children.size;
  }

  isEndOfWord() {
    return 0 < this.endCount;
  }

  /**
   * 添加子节点
   */
  addChild(character: string) {
    this.children.set(character, new TrieNode());
  }

  /**
   * 移除指定子节点
   */
  removeChild(character: string) {
    const childNode = this.getChild(character);
    childNode.includeCount--;
  }

  /**
   * 0 == includeCount 的情况下, 删除子节点
   */
  tryDeleteChild(character: string) {
    if (0 == this.includeCount) {
      this.children.delete(character);
      return true;
    }
    return false;
  }

  /**
   * 获取指定子节点
   */
  getChild(character: string) {
    return this.children.get(character)!;
  }

  /**
   * 是否包含子节点
   */
  hasChild(character: string) {
    return this.children.has(character);
  }

  /**
   * 获取所有子节点
   */
  getChildren() {
    return this.children;
  }

  /**
   * 包含的子节点的个数
   */
  childrenCount() {
    return this.includeCount - this.endCount;
  }

  /**
   * 增加通过次数
   */
  increaseIncludeCount(value = 1) {
    this.includeCount += value;
  }

  /**
   * 减少包含次数
   */
  decreaseIncludeCount(value = 1) {
    this.includeCount -= value;
  }

  /**
   * 是否包含任何字符
   * 主要是用来处理 ''
   */
  hasIncludeWords() {
    return 0 < this.includeCount;
  }

  /**
   * 增加以当前字符为结尾的次数
   */
  increaseEndCount(value = 1) {
    this.endCount += value;
  }

  /**
   * 减少以当前字符为结尾的次数
   */
  decreaseEndCount(value = 1) {
    this.endCount -= value;
  }
}

export default TrieNode;
