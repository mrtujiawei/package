import Iterator from './iterators/Iterator';

/**
 * An instance of this class reports whether insert operation was successful.
 * if a node was added, or an existing one replaced then an iterator is provided. Otherwise the value of iterator is undefined
 */
class InsertionResult {
  /**
   * @param wasAdded
   * @param wasReplaced
   * @param iterator 添加或替换成功才有
   */
  constructor(
    public wasAdded: boolean,
    public wasReplaced: boolean,
    public iterator: Iterator
  ) {}
}

export default InsertionResult;
