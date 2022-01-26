import JsIterator from "./JsIterator";

/* Containers are expected to support the following methods:
   jsRbegin() - returns the very first node in reverse order (e.g. the very last node)
   jsrEnd() - returns the node beyond the last one in reverse order (e.g. the node before the first one)
   next(node) - returns the next node
   prev(node) - returns the previous node
   valuePolicy - an instance of KeyOnlyPolicy, or KeyValuePolicy */
/**
 * ES6-style backward iterator
 * @example
 * let m = new TreeMap();
 * ...
 * // iterate all key-value pairs in reverse order
 * for (let [key, value] of m.backwards()) {
 *   console.log(`key: ${key}, value: ${value}`);
 * }
 * // iterate keys in reverse order
 * for (let key of m.keys().backwards()) {
 *   console.log(`key: ${key}`);
 * }
 */
class JsReverseIterator {
  container: any;

  valuePolicy: any;

  node: any;
  /**
   * @param container
   */
  constructor(container: any, valuePolicy = container.valuePolicy) {
    /**
     * Internal reference to a container
     */
    this.container = container;
    /**
     * valuePolicy implements what members of the node will be returned: key, value, or key and value
     */
    this.valuePolicy = valuePolicy;
    /**
     * @private
     * current node
     */
    this.node = container.jsRbegin();
  }

  /**
   * As documented in ES6 iteration protocol. It can be used for manual iteration.
   * Iterators are documented here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
   *
   * @example
   * let m = new TreeMap();
   * ...
   * let jsIt = m.entries().backwards();
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
    res.done = this.node === this.container.jsRend();
    // @ts-ignore
    if (!res.done) {
      // @ts-ignore
      res.value = this.valuePolicy.fetch(this.node);
      this.node = this.container.prev(this.node);
    }
    return res;
  }

  /**
   * Support for ES6 for-of loops.
   * @returns
   */
  [Symbol.iterator]() {
    return this;
  }

  /**
   * A forward iterator for the same container
   * @returns
   * @example
   * let m = new TreeMap();
   * ...
   * // iterate all key-value pairs in direct order
   * for (let [key, value] of m.backwards().backwards()) {
   *   console.log(`key: ${key}, value: ${value}`);
   */
  backwards() {
    return new JsIterator(this.container, this.valuePolicy);
  }
}

export default JsReverseIterator;
