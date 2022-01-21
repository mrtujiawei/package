import { Stack, } from '../src/index';

test('New stack should be empty', () => {
  let stack = new Stack();
  expect(stack.isEmpty()).toBe(true);
});

test('Stack should have 50 items', () => {
  let stack = new Stack();
  for (let i = 0; i < 100; i++) {
    stack.push(i);
    if (0 == i % 2) {
      stack.pop();
    }
  }
  expect(stack.size).toBe(50);
});

test('Stack should have 50 odd items', () => {
  let stack = new Stack<number>();
  for (let i = 0; i < 100; i++) {
    stack.push(i);
    if (0 == i % 2) {
      stack.pop();
    }
  }
  while (!stack.isEmpty()) {
    expect(stack.pop() % 2).toBe(1);
  }
});

test('Peak empty stack show throw error', () => {
  let stack = new Stack();
  expect(() => {
    stack.peak();
  }).toThrow(Stack.StackEmptyError);
});


test('Pop empty stack show throw error', () => {
  let stack = new Stack();
  expect(() => {
    stack.pop();
  }).toThrow(Stack.StackEmptyError);
});
