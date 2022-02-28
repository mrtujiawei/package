import { BinarySearchTree, } from '../src/index';

test('Insert test 1', () => {
  let bTree = new BinarySearchTree<number>(
    (a, b) => a - b,
  );

  for (let i = 0; i < 100; i++) {
    let value = Math.floor(Math.random() * 1000);
    try {
      bTree.append(value);
    } catch (e) {
      // console.log(e.message, value);
    }
  }

  let before = Number.MIN_SAFE_INTEGER;
  bTree.inorderTraversal(value => {
    expect(before).toBeLessThan(value);
    before = value;
  });
});

test('Insert test 2', () => {
  let bTree = new BinarySearchTree<number>(
    (a, b) => b - a,
  );

  for (let i = 0; i < 100; i++) {
    let value = Math.floor(Math.random() * 1000);
    try {
      bTree.append(value);
    } catch (e) {
      // console.log(e.message, value);
    }
  }

  let before = Number.MAX_SAFE_INTEGER;
  bTree.inorderTraversal(value => {
    expect(before).toBeGreaterThan(value);
    before = value;
  });
});

test('Remove top with no child test', () => {
  let bTree = new BinarySearchTree<number>(
    (a, b) => a -b,
  );
  bTree.append(0);
  bTree.remove(0);

  expect(bTree.toArray()).toEqual([]);
});

test('Remove top with no right child test', () => {
  let bTree = new BinarySearchTree<number>(
    (a, b) => a -b,
  );
  bTree.append(0);
  bTree.append(-1);
  bTree.remove(0);

  expect(bTree.toArray()).toEqual([-1]);
});

test('Remove top with no left child test', () => {
  let bTree = new BinarySearchTree<number>(
    (a, b) => a - b,
  );

  bTree.append(0);
  bTree.append(1);
  bTree.remove(0);

  expect(bTree.toArray()).toEqual([1]);
});

test('Remove top with have both left and right child test', () => {
  let bTree = new BinarySearchTree<number>(
    (a, b) => a - b,
  );

  bTree.append(0);
  bTree.append(1);
  bTree.append(-1);
  bTree.remove(0);

  expect(bTree.toArray()).toEqual([-1, 1]);
});

test('Random insert', () => {
  let bTree = new BinarySearchTree<number>(
    (a, b) => a - b,
  );

  const testSize = 10000;

  for (let i = 0; i < testSize; i++) {
    let value = Math.floor(Math.random() * 10 * testSize);
    try {
      bTree.append(value);
    } catch (e) {

    }
  }

  let before = Number.MIN_SAFE_INTEGER;
  bTree.inorderTraversal(value => {
    expect(before).toBeLessThan(value);
    before = value;
  });
});

test('Random insert and remove', () => {
  let bTree = new BinarySearchTree<number>(
    (a, b) => a - b
  );

  const testSize = 10000;

  for (let i = 0; i < testSize; i++) {
    let value = Math.floor(Math.random() * 10 * testSize);
    try {
      bTree.append(value);
    } catch (e) {
      bTree.remove(value);
    }
    if (Math.random() > .5) {
      bTree.remove(value);
    }
  }

  let before = Number.MIN_SAFE_INTEGER;
  bTree.inorderTraversal(value => {
    expect(before).toBeLessThan(value);
    before = value;
  });
});

test('Get min and max', () => {
  let bTree = new BinarySearchTree<number>(
    (a, b) => a - b
  );

  const testSize = 10000;
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < testSize; i++) {
    let value = Math.floor(Math.random() * 10 * testSize);
    min = Math.min(min, value);
    max = Math.max(max, value);
    try {
      bTree.append(value);
    } catch (e) {

    }
  }

  expect(bTree.getMin()).toEqual(min);
  expect(bTree.getMax()).toEqual(max);
});

test('Clear binarySearchTree', () => {
  let bTree = new BinarySearchTree<number>(
    (a, b) => a - b
  );

  const testSize = 10000;

  for (let i = 0; i < testSize; i++) {
    let value = Math.floor(Math.random() * 10 * testSize);
    try {
      bTree.append(value);
    } catch (e) {

    }
  }

  bTree.clear();

  expect(bTree.toArray()).toEqual([]);
});
