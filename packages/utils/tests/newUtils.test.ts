import { cartesianProduct } from '../src';

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
