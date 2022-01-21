import { TreeSet, } from '../../src/index';

describe('TreeSet test', () => {
  const buildTreeSet = (...values: number[]) => {
    const set = new TreeSet<number>((a, b) => a - b);
    values.forEach(value => {
      set.add(value);
    });
    return set;
  };

  test('constructor', () => {
    const set = buildTreeSet();
    expect(set.size).toBe(0);
  });

  test('add test', () => {
    const set = buildTreeSet(2, 1, 3);
    expect(set.size).toBe(3);

    const nums: number[] = [];
    set.forEach(value => {
      nums.push(value);
    });
    expect([1, 2, 3]).toEqual(nums);
  });

  test('clear test', () => {
    const set = buildTreeSet(2, 1, 3);
    expect(set.size).toBe(3);

    set.clear();
    expect(set.size).toEqual(0);
  });

  test('delete test 0', () => {
    const set = buildTreeSet(2, 1, 3);
    expect(set.size).toBe(3);

    set.delete(2);
    expect(set.has(2)).toBeFalsy();
    expect(set.has(1)).toBeTruthy();
    expect(set.has(3)).toBeTruthy();
    expect(set.has(4)).toBeFalsy();
    expect(set.size).toEqual(2);

    const nums: number[] = [];
    set.forEach(value => {
      nums.push(value);
    });
    expect(nums).toEqual([1, 3]);
  });

  test('delte test 1', () => {
    const set = buildTreeSet(1, 2, 3);
    set.delete(3);
    set.delete(2);
    expect(set.size).toBe(1);
    expect(set.has(1)).toBeTruthy();
    expect(set.has(2)).toBeFalsy();
    expect(set.has(3)).toBeFalsy();
    set.add(4);
    expect(set.has(1)).toBeTruthy();
    expect(set.has(2)).toBeFalsy();
    expect(set.has(3)).toBeFalsy();
    expect(set.has(4)).toBeTruthy();
  });
});
