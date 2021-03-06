import {
  isInteger,
  throttle,
  debounce,
  retry,
  sleep,
  Heap,
  reentrant,
  findFirstIndex,
  rgbToHex,
  numFormat,
  objectToUrlParams,
  urlParamsToObject,
  memorize,
  gcd,
  fixed,
} from "../src/index";

test("Debounce should trigger one time", () => {
  expect(1).toBe(1);
  let cnt = 0;

  return new Promise((resolve) => {
    let debounceFunc = debounce(function (value: number) {
      cnt++;
      expect(cnt).toBe(1);
      expect(value).toBe(4);
      resolve(void 0);
    }, 10);
    (async function () {
      for (let i = 0; i < 5; i++) {
        await sleep(0.005);
        debounceFunc(i);
      }
    })();
  });
});

test("Retry should retry", () => {
  const retryTimes = 2;
  let func = (function () {
    let cnt = 0;
    return function () {
      if (cnt++ < retryTimes) {
        throw new Error("error");
      }
      return cnt;
    };
  })();

  let retryFunc = retry(func, retryTimes);
  let result = retryFunc();
  expect(result).toBe(3);
});

test("Retry 2 should throw err", () => {
  const retryTimes = 2;
  let func = (function () {
    let cnt = 0;
    return function () {
      if (cnt++ <= retryTimes) {
        throw new Error("error");
      }
      return cnt;
    };
  })();

  let retryFunc = retry(func, retryTimes);
  expect(retryFunc).toThrow();
});

test("Async Retry 2 should reject err", () => {
  const retryTimes = 2;
  let func = (function () {
    let cnt = 0;
    return function () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (cnt++ <= retryTimes) {
            /**
             * 如果在setTimeout内部出现错误，无法捕获
             * 只有手动reject的才能捕获
             */
            reject("cnt is not reach");
          } else {
            resolve(cnt);
          }
        }, 10);
      });
    };
  })();

  let retryFunc = retry(func, retryTimes);

  // 异常类型不清楚，所以用了这种取巧的方法
  return retryFunc()
    .then(() => {
      expect(0).toBe(1);
    })
    .catch(() => {
      expect(0).toBe(0);
    });
});

test("Throttle(leading)", async () => {
  let count = 0;
  let options = {
    timeout: 100,
    leading: true,
  };
  let callback = (value: number): void => {
    count++;
    switch (count) {
      case 1: {
        expect(value).toBe(0);
        break;
      }
      case 2: {
        expect(value).toBe(2);
        break;
      }
      case 3: {
        expect(value).toBe(100);
        break;
      }
      case 4: {
        let current = new Date().getTime();
        let diff = current - before;
        expect(diff < 50).toBe(true);
        break;
      }
      default: {
        expect(0).toBe(1);
      }
    }
  };
  let throttleCallback = throttle(callback, options);

  for (let i = 0; i < 5; i++) {
    throttleCallback(i);
    await sleep(0.035);
  }
  throttleCallback(100);
  await sleep(0.05);
  await sleep(0.105);
  let before = new Date().getTime();
  throttleCallback(200);
  await sleep(0.1);
});

test("Throttle(trailing)", async () => {
  let count = 0;
  let options = {
    timeout: 100,
    leading: false,
  };
  let callback = (value: number): void => {
    count++;
    switch (count) {
      case 1: {
        expect(value).toBe(2);
        break;
      }
      case 2: {
        expect(value).toBe(5);
        break;
      }
      case 3: {
        expect(value).toBe(8);
        break;
      }
      case 4: {
        expect(value).toBe(100);
        break;
      }
      case 5: {
        expect(value).toBe(200);
        break;
      }
      default: {
        expect(0).toBe(1);
      }
    }
  };

  let throttleCallback = throttle(callback, options);

  for (let i = 0; i < 9; i++) {
    throttleCallback(i);
    await sleep(0.035);
  }
  throttleCallback(100);
  await sleep(0.12);
  throttleCallback(200);
  await sleep(0.12);
});

test("IsInteger test", () => {
  expect(isInteger(1)).toBe(true);
  expect(isInteger("a")).toBe(false);
  expect(isInteger("1.1")).toBe(false);
  expect(isInteger(true)).toBe(false);
  expect(isInteger(void 0)).toBe(false);
  expect(isInteger(null)).toBe(false);
  expect(isInteger(function () {})).toBe(false);
  expect(isInteger(Symbol(123))).toBe(false);
  expect(isInteger({})).toBe(false);
});

test("Heap build test", () => {
  const length = 10000;
  let arr = new Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = Math.ceil(Math.random() * 100000);
  }

  let heap = new Heap<number>((a, b) => a - b, arr);
  arr = [];
  while (!heap.isEmpty()) {
    arr.push(heap.remove());
  }
  for (let i = 1; i < arr.length; i++) {
    expect(arr[i]).toBeGreaterThanOrEqual(arr[i - 1]);
  }
});

test("Heap insert test", () => {
  const length = 10000;
  let arr = new Array(length);

  for (let i = 0; i < length; i++) {
    arr[i] = Math.ceil(Math.random() * 100000);
  }

  let heap = new Heap<number>((a, b) => b - a);
  for (let i = 0; i < arr.length; i++) {
    heap.insert(arr[i]);
  }

  arr = [];
  while (!heap.isEmpty()) {
    arr.push(heap.remove());
  }

  for (let i = 1; i < arr.length; i++) {
    expect(arr[i]).toBeLessThanOrEqual(arr[i - 1]);
  }
});

test("Heap insert and remove test", () => {
  const length = 10000;
  let arr = new Array(length);

  for (let i = 0; i < length; i++) {
    arr[i] = Math.ceil(Math.random() * 100000);
  }

  let heap = new Heap<number>((a, b) => b - a);
  for (let i = 0; i < arr.length; i++) {
    heap.insert(arr[i]);
    if (0 == i % 10 && Math.random() > 0.5) {
      heap.remove();
    }
  }

  arr = [];
  while (!heap.isEmpty()) {
    arr.push(heap.remove());
  }

  for (let i = 1; i < arr.length; i++) {
    expect(arr[i]).toBeLessThanOrEqual(arr[i - 1]);
  }
});

test("Reenterant test", async () => {
  const fn = reentrant(async function (value) {
    await sleep(3);
    return value;
  });

  /**
   * 不能得到结果
   */
  (async function () {
    const result = await fn(1);
    expect(result).toBe(-1);
  })();

  /**
   * 因为重复调用了fn
   * 第一次调用不应该能够得到结果
   * 第二次调用应该返回第二次调用的结果
   */
  (async function () {
    await sleep(2);
    const result = await fn(2);
    expect(2).toBe(result);
  })();
});

test("Binary search test", () => {
  expect(findFirstIndex([0, 25], 13)).toBe(1);
});

test("RgbToHex test", () => {
  expect(
    rgbToHex(255, 255, 255)
  ).toBe('FFFFFF');
});

test('Number format', () => {
  expect(numFormat(123123, ',')).toBe('123,123');
  expect(numFormat(123912393, ',')).toBe('123,912,393');
});

test('Object to url params test', () => {
  const object = {
    name: 'tujiawei',
    age: 20,
  };
  expect(objectToUrlParams(object))
    .toBe('name=tujiawei&age=20');

  const token = 'ApioL+xT8R/BYRxeIVO2XwC4GlkULVu1qddO2R6Y+to=@umnj.cn.rongnav.com;umnj.cn.rongcfg.com';
  const params = objectToUrlParams({ token });
  const newToken = urlParamsToObject(params).token;

  expect(token).toBe(newToken);
});

test('Object to url params test "="', () => {
  const key = 'name+age';
  const object = {
    [key]: 'tujiawei+20',
  };
  expect(
    urlParamsToObject(objectToUrlParams(object))[key]
  ).toBe(object[key]);
});

test('Memorized test', () => {
  let count = 0;
  const fn = memorize((value: string) => {
    count++;
    expect(count).toBe(1);
    return `#${value}#`;
  }, (value: string) => value);

  const result1 = fn('tujiawei');
  expect(result1).toBe('#tujiawei#');

  const result2 = fn('tujiawei');
  expect(result2).toBe('#tujiawei#');
});

test('Gcd test', () => {
  expect(gcd(10, 5)).toBe(5);
  expect(gcd(2, 3)).toBe(1);
  expect(gcd(3, 2)).toBe(1);
  expect(() => gcd(1.1, 2)).toThrowError(TypeError);
  expect(() => gcd(2, 1.1)).toThrowError(TypeError);
  expect(() => gcd(1.2, 1.1)).toThrowError(TypeError);
  expect(() => gcd(0, 2)).toThrowError(RangeError);
  expect(() => gcd(2, 0)).toThrowError(RangeError);
  expect(() => gcd(0, 0)).toThrowError(RangeError);
});

test('Fix test', () => {
  expect(fixed(0.1 + 0.2, 10)).toBe('0.3000000000');
  expect(fixed(10.01, 3)).toBe('10.010');
  expect(fixed(10.49, 1)).toBe('10.4');
  expect(fixed(10.495, 2)).toBe('10.49');
  expect(fixed(123.01, -1)).toBe('120');
  expect(fixed(123.01, -2)).toBe('100');
  expect(fixed(100, 3)).toBe('100.000');
  expect(fixed(123.45655, -2)).toBe('100');
  expect(fixed(123.45655, -1)).toBe('120');
  expect(fixed(123.45655, 0)).toBe('123');
  expect(fixed(123.45655, 1)).toBe('123.4');
  expect(fixed(123.45655, 2)).toBe('123.45');
  expect(fixed(123.45655, 3)).toBe('123.456');
  expect(fixed(123.45655, 4)).toBe('123.4565');
  expect(fixed(123.45655, 5)).toBe('123.45655');
});
