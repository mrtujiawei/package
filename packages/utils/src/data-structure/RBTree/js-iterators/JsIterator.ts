/* Containers are expected to support the following methods:
   jsBegin() - returns the very first node
   jsEnd() - returns the node beyond the last one
   next(node) - returns the next node
   prev(node) - returns the previous node
   valuePolicy - an instance of KeyOnlyPolicy, or KeyValuePolicy */

import JsReverseIterator from './JsReverseIterator';

/**
 * ES6-style forward iterator.
 *
 * @example
 * let m = new TreeMap();
 * ...
 * for (let [key, value] of m) {
 *   console.log(`key: ${key}, value: ${value}`);
 * }
 * // iterate values
 * for (let value of m.values()) {
 *   console.log(`value: ${value}`);
 * }
 */
class JsIterator {
  container: any;

  valuePolicy: any;

  node: any;

  /**
   * @param container
   */
  constructor(container: any, valuePolicy = container.valuePolicy) {
    /**
     * @private
     * Internal reference to a container
     */
    this.container = container;
    /**
     * @private
     * valuePolicy implements what members of the node will be returned: key, value, or key and value
     */
    this.valuePolicy = valuePolicy;
    /**
     * @private
     * current node
     */
    this.node = container.jsBegin();
  }

  /**
   * As documented in ES6 iteration protocol. It can be used for manual iteration.
   * Iterators are documented here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
   *
   * @example
   * let m = new TreeMap();
   * ...
   * let jsIt = m.entries();
   * while (true) {
   *   let res = it.next();
   *   if (res.done) {
   *     break;
   *   }
   *   console.log(`key: ${res.value[0]}, value: ${res.value[1]`});
   * }
   */
  next() {
    let res = {};
    // @ts-ignore
    res.done = this.node === this.container.jsEnd();
    // @ts-ignore
    if (!res.done) {
      // @ts-ignore
      res.value = this.valuePolicy.fetch(this.node);
      this.node = this.container.next(this.node);
    }
    return res;
  }

  /**
   * Support for ES6 for-of loops.
   */
  [Symbol.iterator]() {
    return this;
  }

  /**
   * A reverse iterator for the same container.
   * @returns
   * @example
   * let m = new TreeMap();
   * ...
   * // iterate all key-value pairs in reverse order
   * for (let [key, value] of m.backwards()) {
   *   console.log(`key: ${key}, value: ${value}`);
   * }
   */
  backwards() {
    // eslint-disable-next-line no-use-before-define
    return new JsReverseIterator(this.container, this.valuePolicy);
  }
}

export default JsIterator;
