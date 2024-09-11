import backpack from '../../algorithm/backpack';

test('Backpack test', () => {
  let values = [6, 3, 5, 4, 6];
  let weights = [2, 2, 6, 5, 4];
  let capacity = 10;

  expect(backpack(values, weights, capacity)).toBe(15);
});
