/**
 * 插入结果
 * @filename: src/data-structure/RBTree/InsertResult.ts
 * @author: Mr Prince
 * @date: 2022-02-07 17:00:58
 */
class InsertResult {
  added: boolean = false;
  replaced: boolean = false;
  constructor(wasAdded: boolean, wasReplaced: boolean) {
    this.added = wasAdded;
    this.replaced = wasReplaced;
  }

  isAdded() {
    return this.added;
  }

  isReplaced() {
    return this.replaced;
  }
}

export default InsertResult;
