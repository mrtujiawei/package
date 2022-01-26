import Iterator from './Iterator';
import BaseIterator from './BaseIterator';

/**
 * STL-like backward iterator. Can be used to traverse container or a range in the reverse order.
 * It's more verbose than ES6 iterators, but allows iteration over any part of the container
 *
 * @example
 * let m = new TreeMap();
 * ...
 * for (let it = m.rbegin(); !it.equals(m.end()); it.next()) {
 *   console.log(`key: ${it.key}, value: ${it.value}`);
 * }
 */
class ReverseIterator extends BaseIterator {
  /**
   * There are 3 ways to construct a reverse iterator:
   *
   * 1. Using a node and a container
   * 2. Copy constructor / clone
   * 3. Copy constructor / clone from forward Iterator instance
   * @param {*} args
   *
   * @example
   * // Using a node and a container
   * let it = new ReverseIterator(node, container);
   *
   * // Copy constructor / clone
   * let it1 = new ReverseIterator(node, container);
   * let it2 = new ReverseIterator(it1);
   *
   * // Copy constructor / clone from forward Iterator instance
   * let it1 = new Iterator(node, container);
   * let it2 = new ReverseIterator(it1);
   */
  constructor(...args: any[]) {
    if (args.length === 2) {
      let [node, container] = args;
      super(node, container);
    } else if (args.length === 1) {
      let [obj] = args;
      let className = obj.constructor.name;
      if (className === ReverseIterator.name) {
        super(obj.__n, obj.__c);
      } else if (className === Iterator.name) {
        let c = obj.__c;
        super(c.prev(obj.__n), c);
      } else {
        throw new Error(`Can't create an ReverseIterator from ${className}`);
      }
    } else {
      throw new Error(
        "Can't create a Reverse Iterator with provided parameters"
      );
    }
  }

  /**
   *  Replaces node reference with the reference of the previous node in the container, because it works in reverse order
   * Can be used for manual reverse iteration over a range of key-value pairs.
   * @example
   * let m = new TreeMap();
   * ... // add key-value pairs., using numbers as keys
   * let from = new ReverseIterator(t.upperBound(50));
   * let to = new ReverseIterator(t.lowerBound(0));
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
    this.__n = this.__c.prev(this.__n);
  }

  /**
   *  Replaces node reference with the reference of the next node in the container, because it works in reverse order
   * Can be used for manual forward iteration over a range of key-value pairs.
   * @example
   * let m = new TreeMap();
   * ... // add key-value pairs., using numbers as keys
   * let from = new ReverseIterator(t.upperBound(50));
   * let to = new ReverseIterator(t.lowerBound(0));
   * let it = to;
   * while (!it.equals(from)) {
   *   it.prev();
   *   console.log(it.key);
   * }
   */
  prev() {
    // @ts-ignore
    this.__n = this.__c.next(this.__n);
  }
}

export default ReverseIterator;
