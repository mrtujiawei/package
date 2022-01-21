import { Comparable } from '../src/index';

describe('Interface test', () => {
  test('Comparable interface test', () => {
    class Item implements Comparable<Item> {
      constructor(private key: number) {}
      compareTo(value: Item): number {
        return this.key - value.key;
      }
    }
    const a = new Item(0);
    const b = new Item(1);
    expect(a.compareTo(b)).toBeLessThan(0);
    expect(b.compareTo(a)).toBeGreaterThan(0);
    expect(a.compareTo(a)).toBe(0);
    expect(b.compareTo(b)).toBe(0);
  });
});
