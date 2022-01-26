import BaseIterator from './BaseIterator';
import ReverseIterator from './ReverseIterator';

class Iterator extends BaseIterator {
  /**
   * There are 3 ways to construct an iterator:
   *
   * 1. Using a node and a container
   * 2. Copy constructor / clone
   * 3. Copy constructor / clone from ReverseIterator instance
   * @param {*} args
   *
   * @example
   * // Using a node and a container
   * let it = new Iterator(node, container);
   *
   * // Copy constructor / clone
   * let it1 = new Iterator(node, container);
   * let it2 = new Iterator(it1);
   *
   * // Copy constructor / clone from ReverseIterator instance
   * let it1 = new ReverseIterator(node, container);
   * let it2 = new Iterator(it1);
   */
  constructor(...args: any[]) {
    if (args.length === 2) {
      let [node, container] = args;
      super(node, container);
    } else if (args.length === 1) {
      let [obj] = args;
      let className = obj.constructor.name;
      if (className === Iterator.name) {
        super(obj.__n, obj.__c);
      }
      // eslint-disable-next-line no-use-before-define
      else if (className === ReverseIterator.name) {
        let c = obj.__c;
        super(c.next(obj.__n), c);
      } else {
        throw new Error(`Can't create an Iterator from ${className}`);
      }
    } else {
      throw new Error('参数错误，无法创建迭代器');
    }
  }

  /**
   * Replaces node reference with the reference of the next node in the container.
   * Can be used for manual iteration over a range of key-value pairs.
   * @example
   * let m = new TreeMap();
   * ... // add key-value pairs., using numbers as keys
   * let from = t.lowerBound(0);
   * let to = t.upperBound(50);
   * let it = from;
   * while (!it.equals(to)) {
   *   console.log(it.key);
   *   it.next();
   * }
   */
  next() {
    /**
     * __n and __c are defined in the base class
     */
    // @ts-ignore
    this.__n = this.__c.next(this.__n);
  }

  /**
   * Replaces node reference with the reference of the previous node in the container
   * Can be used for manual reverse iteration over a range of key-value pairs.
   * @example
   * let m = new TreeMap();
   * ... // add key-value pairs., using numbers as keys
   * let from = t.lowerBound(0);
   * let to = t.upperBound(50);
   * let it = to;
   * while (!it.equals(from)) {
   *   it.prev();
   *   console.log(it.key);
   * }
   */
  prev() {
    // @ts-ignore
    this.__n = this.__c.prev(this.__n);
  }
}

export default Iterator;
