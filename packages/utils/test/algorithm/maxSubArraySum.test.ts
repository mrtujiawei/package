import maxSubArraySum from '../../src/algorithm/maxSubArraySum';

test('Max sub array sum', () => {
  let arr = [-2, -1, -3, 4, -1, 2, 1, -5, 4];
  let max = maxSubArraySum(arr);
  expect(max).toBe(6);
});
