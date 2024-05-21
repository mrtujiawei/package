import { articulationPoints } from '../src';

describe('articulationPoints test', () => {
  test('test 1', () => {
    const res = articulationPoints([
      [Infinity, 1, Infinity, Infinity],
      [Infinity, Infinity, 1, Infinity],
      [Infinity, Infinity, Infinity, 1],
      [Infinity, Infinity, Infinity, Infinity],
    ]);

    expect(res.sort((a, b) => a - b)).toEqual([1, 2]);
  });
});
