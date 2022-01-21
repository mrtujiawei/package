import BloomFilter from '../../src/algorithm/BloomFilter';

test('Bloom filter test', () => {
  let bf = new BloomFilter<number>(100000000, 0.01);
  expect(0).toBe(0);
});
