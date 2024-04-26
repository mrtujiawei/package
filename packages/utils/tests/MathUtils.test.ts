import { binaryToDecimal, fastPow, getPrimeList, isPrime, lcm } from '../src/index';

describe('MathUtils test', () => {
  test('fastPow test', () => {
    const results = [
      1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384,
      32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608,
      16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 73741817,
      147483634, 294967268, 589934536, 179869065, 359738130, 719476260,
      438952513, 877905026, 755810045, 511620083, 23240159, 46480318, 92960636,
      185921272, 371842544, 743685088, 487370169, 974740338, 949480669,
      898961331, 797922655, 595845303, 191690599, 383381198, 766762396,
      533524785, 67049563, 134099126, 268198252, 536396504,
    ];
    results.forEach((result, index) => {
      expect(result).toBe(fastPow(2, index, 10 ** 9 + 7));
    });

    const base = Math.floor(Math.random() * 1000) + 2;
    const index = Math.floor(Math.random() * 10000);
    const mod = 990001;

    for (let i = 0, value = 1; i <= index; i++) {
      expect(fastPow(base, i, mod)).toBe(value);
      value = (value * base) % mod;
    }
  });

  test('Prime list test', () => {
    expect(getPrimeList(10)).toStrictEqual([2, 3, 5, 7]);
  });

  test('Prime test', () => {
    getPrimeList(10).forEach((num) => {
      expect(isPrime(num)).toBeTruthy();
    });
    expect(isPrime(2)).toBeTruthy();
    expect(isPrime(3)).toBeTruthy();
    expect(isPrime(11)).toBeTruthy();
    expect(isPrime(10 ** 9 + 7)).toBeTruthy();
    expect(isPrime(4)).toBeFalsy();
    expect(isPrime(9)).toBeFalsy();
  });

  test('LCM test', () => {
    expect(lcm(2, 3)).toBe(6);
    expect(lcm(7, 15)).toBe(105);
    expect(lcm(10, 5)).toBe(10);
    expect(lcm(20, 6)).toBe(60);
  });

  test('binaryToDecimal test', () => {
    expect(binaryToDecimal('1000')).toBe(8);
    expect(binaryToDecimal('10000001')).toBe(129);
  })
});
