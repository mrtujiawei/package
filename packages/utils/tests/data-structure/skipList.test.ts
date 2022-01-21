import { SkipList, Random } from '../../src';

describe('Skiplist test', () => {
  const size = 100;
  function getRandomList() {
    const list = new SkipList<number>((a, b) => a - b);
    for (let i = 0; i < size; i++) {
      const value = Random.getRandomNumber(1, size + 1);
      list.insert(value);
    }
    return list;
  }

  test('Insert test', () => {
    const list = getRandomList();
    expect(list.length).toBe(size);

    let before = -1;
    list.forEach((value) => {
      expect(before).toBeLessThanOrEqual(value);
      before = value;
    });
  });

  test('Remove test', () => {
    const list = getRandomList();
    const values = list.toArray();
    values.sort(() => Random.getRandomNumber(0, 1) - 0.5);
    values.forEach((value) => {
      expect(list.remove(value)).toBeTruthy();
    });
    expect(list.length).toBe(0);
  });

  test('Insert unique test', () => {
    const list = getRandomList();
    list.forEach((value) => {
      expect(list.insert(value, SkipList.INSERT_MODE.UNIQUE)).toBeFalsy();
    });
    expect(list.insert(size + 1, SkipList.INSERT_MODE.UNIQUE)).toBeTruthy();
  });

  test('Search test', () => {
    const list = getRandomList();
    list.forEach((value) => {
      expect(list.search(value)).toBeTruthy();
    });
    expect(list.search(size + 1)).toBeFalsy();
  });
});
