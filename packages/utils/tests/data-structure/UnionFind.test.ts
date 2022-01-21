import { UnionFind } from '../../src/index';

describe('UnionFind test', () => {
  test('union test 1', () => {
    const unionFind = new UnionFind(3);
    unionFind.union(0, 1);
    unionFind.union(0, 2);
    expect(unionFind.isUnion(1, 2)).toBeTruthy();
  });

  test('union test 2', () => {
    const unionFind = new UnionFind(3);
    unionFind.union(0, 1);
    unionFind.union(1, 2);
    expect(unionFind.isUnion(0, 1)).toBeTruthy();
  });

  test('union test 3', () => {
    const unionFind = new UnionFind(3);
    unionFind.union(0, 1);
    unionFind.union(1, 2);
    expect(unionFind.isUnion(0, 2)).toBeTruthy();
  });

  test('union test 4', () => {
    const unionFind = new UnionFind(3);
    unionFind.union(0, 1);
    unionFind.union(1, 2);
    expect(unionFind.isUnion(1, 2)).toBeTruthy();
  });

  test('union test 5', () => {
    const unionFind = new UnionFind(4);
    unionFind.union(0, 1);
    unionFind.union(2, 3);
    expect(unionFind.isUnion(0, 2)).toBeFalsy();
    expect(unionFind.isUnion(0, 3)).toBeFalsy();
    expect(unionFind.isUnion(1, 2)).toBeFalsy();
    expect(unionFind.isUnion(1, 3)).toBeFalsy();

    unionFind.union(0, 2);
    expect(unionFind.isUnion(0, 2)).toBeTruthy();
    expect(unionFind.isUnion(0, 3)).toBeTruthy();
    expect(unionFind.isUnion(1, 2)).toBeTruthy();
    expect(unionFind.isUnion(1, 3)).toBeTruthy();
    expect(unionFind.isUnion(0, 1)).toBeTruthy();
    expect(unionFind.isUnion(2, 3)).toBeTruthy();
  });
});
