import { SparseTable } from '../../src';

describe('SparseTable test', () => {
  test('query test', () => {
    const values = [0, 13, 14, 4, 13, 1, 5, 7];
    const st = new SparseTable(values);

    expect(st.query(0, 0)).toBe(0);
    expect(st.query(0, 1)).toBe(13);
    expect(st.query(0, 2)).toBe(14);
    expect(st.query(0, 3)).toBe(14);
    expect(st.query(0, 4)).toBe(14);
    expect(st.query(0, 5)).toBe(14);
    expect(st.query(0, 6)).toBe(14);
    expect(st.query(0, 7)).toBe(14);

    expect(st.query(1, 1)).toBe(13);
    expect(st.query(1, 2)).toBe(14);
    expect(st.query(1, 3)).toBe(14);
    expect(st.query(1, 4)).toBe(14);
    expect(st.query(1, 5)).toBe(14);
    expect(st.query(1, 6)).toBe(14);
    expect(st.query(1, 7)).toBe(14);

    expect(st.query(2, 2)).toBe(14);
    expect(st.query(2, 3)).toBe(14);
    expect(st.query(2, 4)).toBe(14);
    expect(st.query(2, 5)).toBe(14);
    expect(st.query(2, 6)).toBe(14);
    expect(st.query(2, 7)).toBe(14);

    expect(st.query(3, 3)).toBe(4);
    expect(st.query(3, 4)).toBe(13);
    expect(st.query(3, 5)).toBe(13);
    expect(st.query(3, 6)).toBe(13);
    expect(st.query(3, 7)).toBe(13);

    expect(st.query(4, 4)).toBe(13);
    expect(st.query(4, 5)).toBe(13);
    expect(st.query(4, 6)).toBe(13);
    expect(st.query(4, 7)).toBe(13);

    expect(st.query(5, 5)).toBe(1);
    expect(st.query(5, 6)).toBe(5);
    expect(st.query(5, 7)).toBe(7);

    expect(st.query(6, 6)).toBe(5);
    expect(st.query(6, 7)).toBe(7);

    expect(st.query(7, 7)).toBe(7);
  });
});
