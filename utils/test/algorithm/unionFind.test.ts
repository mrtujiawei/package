import UnionFind from '../../src/algorithm/UnionFind';

test('Union find test', () => {
  let unionSet: UnionFind = new UnionFind(10);

  unionSet.union(1, 0);
  unionSet.union(1, 2);
  unionSet.union(4, 0);

  // console.log(unionSet);
});
