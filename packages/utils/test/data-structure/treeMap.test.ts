import { Random, TreeMap } from '../../src/index';

describe('TreeMap test', () => {
  const size = 1000;

  const buildTreeMap = () => {
    const map = new TreeMap<number, number>((a, b) => a - b);
    return map;
  };

  const buildRandomNums = () => {
    const options = { length: size };
    const mapper = (_: any, index: number) => index;
    const nums = Array.from(options, mapper);
    const sorter = () => (Random.getRandomBoolean() ? 1 : -1);
    nums.sort(sorter);
    return nums;
  };

  test('Empty TreeMap test', () => {
    const map = buildTreeMap();

    expect(map.size).toBe(0);
    expect(map.has(0)).toBe(false);
    expect(map.has(-1)).toBe(false);
    expect(map.has(1)).toBe(false);
    map.forEach((value, key) => {
      value != key;
      expect(true).toBe(false);
    });
    expect(map.get(Random.getRandomNumber(0, size))).toBe(void 0);
    map.delete(0);
    map.clear();
  });

  test('TreeMap insert test', () => {
    const map = buildTreeMap();

    const nums = buildRandomNums();
    nums.forEach((value, index) => {
      expect(map.has(value)).toBe(false);

      // 插入之前size和index应该一样
      expect(map.size).toBe(index);

      // 插入之后size要变大
      map.set(value, value);
      expect(map.size).toBe(index + 1);

      // 重复插入size不应该变
      map.set(value, value);
      expect(map.size).toBe(index + 1);
    });

    const newNums: number[] = [];
    map.forEach((value) => {
      newNums.push(value);
    });
    expect(nums.length).toBe(newNums.length);

    for (let i = 1; i < newNums.length; i++) {
      expect(newNums[i - 1]).toBeLessThan(newNums[i]);
    }
  });

  test('TreeMap insert same value test', () => {
    const map = buildTreeMap();
    map.set(0, 1);
    expect(map.has(0)).toBe(true);
    expect(map.get(0)).toBe(1);
    map.set(0, 2);
    expect(map.size).toBe(1);
    expect(map.has(0)).toBe(true);
    expect(map.get(0)).toBe(2);
  });

  test('TreeMap delete test', () => {
    const map = buildTreeMap();
    const nums = buildRandomNums();
    const addedNums = new Set<number>();

    nums.forEach((value) => {
      const num = Random.getRandomNumber(0, size);
      expect(map.has(num)).toBe(addedNums.has(num));
      if (addedNums.has(num)) {
        addedNums.delete(num);
        map.delete(num);
        expect(map.has(num)).toBe(false);
      }
      expect(map.has(value)).toBe(false);
      addedNums.add(value);
      map.set(value, value);
      expect(map.has(value)).toBe(true);
    });
    expect(map.size).toBe(addedNums.size);
    map.clear();
    expect(map.size).toBe(0);
  });
});
