class StockSpanner {
  count = 0;
  minStack = new Stack<{ price: number, index: number }>();

  next(price: number): number {
    this.count++;
    if (this.minStack.isEmpty() || this.minStack.peak().price >= price) {
      this.minStack.push({
        price,
        index: this.count,
      });
    } else {
      return 1;
    }
    return 0;
  }
}

class Stack<T> {
  /**
   * 栈为空时仍获取元素
   */
  static readonly StackEmptyError = class extends Error {
    constructor(message: string = 'Stack is empty') {
      super(message);
    }
  };

  stack: T[] = [];

  /**
   * 获取当前栈的大小
   */
  public get size(): number {
    return this.stack.length;
  }

  /**
   * 判断栈是否为空
   */
  public isEmpty(): boolean {
    return 0 == this.size;
  }

  /**
   * 入栈
   */
  public push(...values: T[]): void {
    values.forEach(value => {
      this.stack.push(value);
    });
  }

  /**
   * 出栈
   */
  public pop(): T {
    if (this.isEmpty()) {
      throw new Stack.StackEmptyError();
    }

    return <T>this.stack.pop();
  }

  /**
   * 返回栈顶元素
   */
  public peak():T {
    if (this.isEmpty()) {
      throw new Stack.StackEmptyError();
    }
    return this.stack[this.stack.length - 1];
  }
}
