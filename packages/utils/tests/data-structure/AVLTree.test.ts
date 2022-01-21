import { AVLTree, Random } from '../../src/index';

describe('AVLTree test', () => {
  test('Size test', () => {
    const tree = new AVLTree<number, number>((a, b) => a - b);
    expect(tree.getSize()).toBe(0);
  });

  test('Append test', () => {
    const tree = new AVLTree<number, number>((a, b) => a - b);
    tree.append(0, 0);
    tree.append(1, 1);
    tree.append(2, 2);
    tree.append(3, 3);
    expect(tree.getSize()).toBe(4);
  });

  test('Has test', () => {
    const tree = new AVLTree<number, number>((a, b) => a - b);
    tree.append(0, 0);
    tree.append(1, 1);
    tree.append(2, 2);
    tree.append(3, 3);
    expect(tree.has(0)).toBeTruthy();
    expect(tree.has(1)).toBeTruthy();
    expect(tree.has(2)).toBeTruthy();
    expect(tree.has(3)).toBeTruthy();
  });

  test('Value test', () => {
    const tree = new AVLTree<number, number>((a, b) => a - b);
    tree.append(0, 0);
    tree.append(1, 1);
    tree.append(2, 2);
    tree.append(3, 3);
    expect(tree.getValue(0)).toBe(0);
    expect(tree.getValue(1)).toBe(1);
    expect(tree.getValue(2)).toBe(2);
    expect(tree.getValue(3)).toBe(3);
  });

  test('Insert same value test', () => {
    const tree = new AVLTree<number, number>((a, b) => a - b);
    tree.append(0, 0);
    tree.append(1, 1);

    expect(() => {
      tree.append(0, 1);
    }).toThrow(AVLTree.DuplicateValueError);
  });

  test('Remove test', () => {
    const tree = new AVLTree<number, number>((a, b) => a - b);
    expect(tree.remove(0)).toBeFalsy();
    tree.append(0, 0);
    tree.append(1, 1);

    expect(tree.remove(0)).toBeTruthy();
    expect(tree.remove(0)).toBeFalsy();
    expect(tree.remove(2)).toBeFalsy();
    expect(tree.remove(1)).toBeTruthy();
    expect(tree.remove(1)).toBeFalsy();
    expect(tree.getSize()).toBe(0);
  });

  test('Clear test', () => {
    const tree = new AVLTree<number, number>((a, b) => a - b);
    tree.append(0, 0);
    tree.append(1, 1);
    tree.clear();

    expect(tree.getSize()).toBe(0);
  });

  test('Random insert and remove test', () => {
    const tree = new AVLTree<number, number>((a, b) => a - b);
    const set = new Set<number>();
    const size = 1000;
    for (let i = 0; i < size; i++) {
      const value = Random.getRandomNumber(0, size * 100);
      if (set.has(value)) {
        expect(tree.remove(value)).toBeTruthy();
      }
      set.add(value);
      tree.append(value, value);
      expect(tree.getSize()).toBe(set.size);
    }
    expect(set.size).toBe(tree.getSize());

    let count = 0;
    set.forEach((value) => {
      count++;
      expect(tree.remove(value)).toBeTruthy();
      expect(tree.getSize()).toBe(set.size - count);
    });

    expect(tree.getSize()).toBe(0);
  });
});
