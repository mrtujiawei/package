/**
 * 策略
 * @filename: src/data-structure/RBTree/policy.ts
 * @author: Mr Prince
 * @date: 2022-01-24 15:29:32
 */

type KeyedNode = {
  key: any;
  [key: string]: any;
};

/**
 * Set 会用到
 */
export class KeyOnlyPolicy {
  fetch(node: KeyedNode) {
    return node.key;
  }

  copy(to: KeyedNode, from: KeyedNode) {
    to.key = from.key;
  }

  toString(node: KeyedNode) {
    return String(node.key);
  }
}

/**
 * Map 会用到
 */
export class KeyValuePolicy {
  fetch(node: KeyedNode) {
    return [node.key, node.value];
  }

  copy(to: any, from: any) {
    to.key = from.key;
    to.value = from.value;
  }

  toString(node: any) {
    return String(node.key) + ':' + String(node.value);
  }
}

/**
 * Iteration 会用到
 */
export class ValueOnlyPolicy {
  fetch(node: any) {
    return node.value;
  }

  copy(to: any, from: any) {
    to.value = from.value;
  }

  toString(node: any) {
    return String(node.value);
  }
}
