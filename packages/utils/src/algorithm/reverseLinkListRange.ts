/**
 * k 个一组翻转链表
 * @filename: src/algorithm/reverseLinkListRange.ts
 * @author: Mr Prince
 * @date: 2021-11-23 19:58:04
 */
class ListNode {
  val: number;
  next!: ListNode;
  constructor(val: number, next: ListNode) {
    this.val = val;
    this.next = next;
  }
}

function reverseKGroup(head: ListNode, k: number): ListNode {
  let prev = new ListNode(-1, head);
  let p = prev;
  while (isNeedReverse(p.next, k)) {
    let front = p;
    let tail = p.next;
    for (let i = 1; i < k; i++) {
      let before = front.next;
      let after = tail.next;

      tail.next = after.next;
      front.next = after;
      after.next = before;
    }
    p = tail;
  }
  return prev.next;
}

function isNeedReverse(head: ListNode, k: number): boolean {
  let count = 0;
  while (head && count < k) {
    count++;
    head = head.next;
  }
  return count >= k;
}
