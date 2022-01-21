/**
 * 前缀和相关测试用例
 * @filename packages/utils/tests/partialSum.test.ts
 * @author Mr Prince
 * @date 2023-02-08 11:20:48
 */
import {
  partialSum,
  partialSum2,
  partialSum2Query,
  partialSum3,
  partialSumQuery,
  shuffle,
} from '../src/index';

describe('Partial sum test', () => {
  const getSum = (values: number[], left: number, right: number) => {
    let sum = 0;
    for (let i = left; i <= right; i++) {
      sum += values[i];
    }
    return sum;
  };

  const getSum2 = (
    values: number[][],
    top: number,
    left: number,
    bottom: number,
    right: number
  ): number => {
    let sum = 0;
    for (let i = top; i <= bottom; i++) {
      for (let j = left; j <= right; j++) {
        sum += values[i][j];
      }
    }

    return sum;
  };
  test('partial sum test 1', () => {
    const values = [1, 2, -1, -2, 3, 5, 9, 10, -100];
    const target = [0, 1, 3, 2, 0, 3, 8, 17, 27, -73];
    expect(partialSum(values)).toStrictEqual(target);
  });

  test('partial sum test 2', () => {
    const size = 100;
    const positives = Array.from({ length: size }, () => {
      return Math.floor(Math.random() * size);
    });
    const negitives = Array.from({ length: size }, () => {
      return Math.floor(Math.random() * size);
    });
    const values = positives.concat(negitives);
    shuffle(values);
    const target = new Array(values.length + 1);
    target[0] = 0;
    for (let i = 0; i < values.length; i++) {
      target[i + 1] = getSum(values, 0, i);
    }
    expect(partialSum(values)).toStrictEqual(target);
  });

  test('partial sum test 3', () => {
    expect(partialSum2([])).toStrictEqual([]);
    expect(partialSum2([[]])).toStrictEqual([[0], [0]]);
    const origin = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    const result = partialSum2(origin);
    result.forEach((row) => {
      expect(row[0]).toBe(0);
    });
    result[0].forEach((value) => {
      expect(value).toBe(0);
    });
    for (let i = 0; i < origin.length; i++) {
      for (let j = 0; j < origin[i].length; j++) {
        const sum = getSum2(origin, 0, 0, i, j);
        expect(sum).toBe(result[i + 1][j + 1]);
      }
    }
  });

  test('partial sum test 4', () => {
    const size = 100;
    const origin = Array.from({ length: size }, () =>
      Array.from(
        { length: size },
        (_, i) => (i % 2 == 0 ? 1 : -1) * Math.floor(Math.random() * size)
      )
    );

    origin.forEach((row) => {
      shuffle(row);
    });
    shuffle(origin);

    const result = partialSum2(origin);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const sum = getSum2(origin, 0, 0, i, j);
        expect(sum).toBe(result[i + 1][j + 1]);
      }
    }
  });

  test('partial sum query test 1', () => {
    const values = [1, 2, -1, -2, 3, 5, 9, 10, -100];
    const target = [0, 1, 3, 2, 0, 3, 8, 17, 27, -73];
    for (let i = 0; i < values.length; i++) {
      const left = Math.floor(Math.random() * i);
      const targetSum = partialSumQuery(target, left, i);
      const sum = getSum(values, left, i);
      expect(targetSum).toBe(sum);
    }
  });

  test('partial sum query test 2', () => {
    const size = 100;
    const positives = Array.from({ length: size }, () => {
      return Math.floor(Math.random() * size);
    });
    const negitives = Array.from({ length: size }, () => {
      return Math.floor(Math.random() * size);
    });
    const values = positives.concat(negitives);
    shuffle(values);
    const target = new Array(values.length + 1);
    target[0] = 0;
    for (let i = 0; i < values.length; i++) {
      target[i + 1] = getSum(values, 0, i);
    }

    for (let i = 0; i < 2 * size; i++) {
      const left = Math.floor(Math.random() * i);
      const sum = getSum(values, left, i);
      expect(partialSumQuery(target, left, i)).toBe(sum);
    }
  });

  test('partial sum query test 3', () => {
    expect(partialSum2([])).toStrictEqual([]);
    expect(partialSum2([[]])).toStrictEqual([[0], [0]]);
    const origin = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    const result = partialSum2(origin);
    for (let i = 0; i < origin.length; i++) {
      for (let j = 0; j < origin[i].length; j++) {
        const top = Math.floor(Math.random() * i);
        const left = Math.floor(Math.random() * j);
        const sum = getSum2(origin, top, left, i, j);
        expect(sum).toBe(partialSum2Query(result, top, left, i, j));
      }
    }
  });

  test('partial sum test 4', () => {
    const size = 100;
    const origin = Array.from({ length: size }, () =>
      Array.from(
        { length: size },
        (_, i) => (i % 2 == 0 ? 1 : -1) * Math.floor(Math.random() * size)
      )
    );

    origin.forEach((row) => {
      shuffle(row);
    });
    shuffle(origin);

    const result = partialSum2(origin);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const top = Math.floor(Math.random() * i);
        const left = Math.floor(Math.random() * j);
        const sum = getSum2(origin, top, left, i, j);
        expect(sum).toBe(partialSum2Query(result, top, left, i, j));
      }
    }
  });
});

describe('Partial sum 3 test', () => {
  test('sum test', () => {
    const values = [
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
    ];
    const result = partialSum3(values);
    expect(result[values.length][values[0].length][values[0][0].length]).toBe(135);
    // console.log(result);
  });
});
