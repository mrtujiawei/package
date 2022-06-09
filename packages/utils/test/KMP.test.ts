import { KMP } from '../src';

describe('KMP search test', () => {
  test('Matched test', () => {
    expect(KMP('ababcabacababababc', 'abacabab')).toBe(5);
    expect(KMP('abababcaa', 'ababc')).toBe(2);
  });

  test('Missed test', () => {
    expect(KMP('ababcabacababababc', 'abacababz')).toBe(-1);
    expect(KMP('abababcaa', 'ababcaaa')).toBe(-1);
  });

  test('Empty test', () => {
    expect(KMP('aaa', '')).toBe(0);
  });
});
