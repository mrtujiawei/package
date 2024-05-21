import { bellmanFord } from '../src';

const INF = Infinity;

const graph = [
  // A
  [INF, 4, 3, INF, 7, INF, INF, INF],
  // B
  [INF, INF, 6, 5, INF, INF, INF, INF],
  // C
  [INF, INF, INF, INF, INF, INF, INF, INF],
  // D
  [INF, INF, 11, INF, INF, 2, 10, INF],
  // E
  [INF, INF, 8, 2, INF, INF, 5, INF],
  // F
  [INF, INF, INF, INF, INF, INF, 3, INF],
  // G
  [INF, INF, INF, INF, INF, INF, INF, INF],
  // H
  [INF, INF, INF, INF, INF, INF, INF, INF],
];

describe('bellmanFord test', () => {
  test('test 1', () => {
    const res = bellmanFord(graph, 0);
    expect(res.distances).toEqual({
      0: 0,
      1: 4,
      2: 3,
      3: 9,
      4: 7,
      5: 11,
      6: 12,
      7: Infinity,
    });
  });
});
