class LinkedNode<T> {
  value: T;
  prev: LinkedNode<T>;
  next: LinkedNode<T>;

  constructor(value?: T, prev?: LinkedNode<T>, next?: LinkedNode<T>) {
    this.value = <T>value;
    this.prev = prev ? prev : null!;
    this.next = next ? next : null!;
  }
}

export default LinkedNode;
