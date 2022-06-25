class LinkedNode<T> {
  value: T;
  prev: LinkedNode<T>;
  next: LinkedNode<T>;

  constructor(value?: T, prev?: LinkedNode<T>, next?: LinkedNode<T>) {
    this.value = <T>value;
    this.prev = prev ? prev : (null as unknown as LinkedNode<T>);
    this.next = next ? next : (null as unknown as LinkedNode<T>);
  }
}

export default LinkedNode;
