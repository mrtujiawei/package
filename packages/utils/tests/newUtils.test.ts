import { cartesianProduct, runLimit, sleep } from '../src';

describe('newUtils test', () => {
  test('cartesianProduct', () => {
    const result = cartesianProduct(['x', 'y', 'z'], ['1', '2', '3']);
    expect(result).toEqual([
      [
        ['x', '1'],
        ['x', '2'],
        ['x', '3'],
      ],
      [
        ['y', '1'],
        ['y', '2'],
        ['y', '3'],
      ],
      [
        ['z', '1'],
        ['z', '2'],
        ['z', '3'],
      ],
    ]);
  });
});

describe('runLimit test', () => {
  test('limit less then tasks', async () => {
    const tasks = Array.from({ length: 20 }, (_, i) => {
      return async () => {
        await sleep(Math.random());
        return i;
      };
    });

    const result = await runLimit(tasks, 3);
    result.forEach((value, index) => {
      expect(value).toBe(index);
    });
  });
});
