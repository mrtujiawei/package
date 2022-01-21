/**
 * 栈
 * @filename: package/packages/utils/src/utils/Stack.ts
 * @author: Mr Prince
 * @date: 2022-02-14 15:44:36
 */
import LinkedList from '../List/LinkedList';

class Stack<T> {
  /**
   * 栈为空时仍获取元素
   */
  static readonly StackEmptyError = class extends Error {
    constructor(message: string = 'Stack is empty') {
      super(message);
    }
  };

  private stack = new LinkedList<T>();

  /**
   * 获取当前栈的大小
   */
  public get size(): number {
    return this.stack.getSize();
  }

  /**
   * 判断栈是否为空
   */
  public isEmpty(): boolean {
    return this.stack.isEmpty();
  }

  /**
   * 判断是否非空
   */
  public isNotEmpty(): boolean {
    return !this.isEmpty();
  }

  /**
   * 入栈
   */
  public push(...values: T[]): void {
    values.forEach((value) => {
      this.stack.insertFirst(value);
    });
  }

  /**
   * 出栈
   */
  public pop(): T {
    if (this.isEmpty()) {
      throw new Stack.StackEmptyError();
    }
    return this.stack.removeFirst();
  }

  /**
   * 返回栈顶元素
   */
  public peak(): T {
    if (this.isEmpty()) {
      throw new Stack.StackEmptyError();
    }
    return this.stack.getFirst();
  }

  clear() {
    this.stack.clear();
  }
}

export default Stack;
