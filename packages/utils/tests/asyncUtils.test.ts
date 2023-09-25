import { cancellable, eagerGet, sleep } from '../src/index';

describe('Async utils test', () => {
  describe('Cancellable test', () => {
    const run = (
      generatorFunction: () => Generator<Promise<any>, any, unknown>,
      cancelledAt?: number,
      target?: {
        resolve?: (value: any) => void;
        reject?: (reason: any) => void;
      }
    ) => {
      const [cancel, promise] = cancellable(generatorFunction());

      promise.then(target?.resolve).catch(target?.reject);

      if (cancelledAt) {
        setTimeout(cancel, cancelledAt);
      }
    };

    test('case 1:', (done) => {
      run(
        function* () {
          return 42;
        },
        100,
        {
          resolve(value) {
            expect(value).toBe(42);
            done();
          },
        }
      );
    });

    test('case 2:', (done) => {
      run(
        function* () {
          const msg = yield new Promise((res) => res('Hello'));
          throw `Error: ${msg}`;
        },
        0,
        {
          reject(reason) {
            expect(reason == 'Error: Hello');
            done();
          },
        }
      );
    });

    test('case 3:', (done) => {
      run(
        function* () {
          yield new Promise((res) => setTimeout(res, 200));
          return 'Success';
        },
        100,
        {
          reject(reason) {
            expect(reason).toBe('Cancelled');
            done();
          },
        }
      );
    });

    test('case 4:', (done) => {
      run(
        function* () {
          let result = 0;
          yield new Promise((res) => setTimeout(res, 100));
          result += (yield new Promise((res) => res(1))) as number;
          yield new Promise((res) => setTimeout(res, 100));
          result += (yield new Promise((res) => res(1))) as number;
          return result;
        },
        0,
        {
          resolve(value) {
            expect(value).toBe(2);
            done();
          },
        }
      );
    });

    test('case 5:', (done) => {
      run(
        function* () {
          let result = 0;
          try {
            yield new Promise((res) => setTimeout(res, 100));
            result += (yield new Promise((res) => res(1))) as number;
            yield new Promise((res) => setTimeout(res, 100));
            result += (yield new Promise((res) => res(1))) as number;
          } catch (e) {
            return result;
          }
          return result;
        },
        150,
        {
          resolve(value) {
            expect(value).toBe(1);
            done();
          },
        }
      );
    });

    test('case 6:', (done) => {
      run(
        function* () {
          try {
            yield new Promise((_resolve, reject) => reject('Promise Rejected'));
          } catch (e) {
            let a = (yield new Promise((resolve) => resolve(2))) as number;
            let b = (yield new Promise((resolve) => resolve(2))) as number;
            return a + b;
          }
        },
        0,
        {
          resolve(value) {
            expect(value).toBe(4);
            done();
          },
        }
      );
    });

    test('case 7:', (done) => {
      run(
        function* () {
          const sleep = (n: number) => new Promise((res) => setTimeout(res, n));
          let result = 0;
          try {
            while (true) {
              yield sleep(50);
              result += 1;
            }
          } catch (e) {
            return result;
          }
        },
        25,
        {
          resolve(value) {
            expect(value).toBe(0);
            done();
          },
        }
      );
    });

    test('case 8:', (done) => {
      run(
        function* () {
          const sleep = (n: number) => new Promise((res) => setTimeout(res, n));
          let result = 0;
          try {
            while (true) {
              yield sleep(50);
              result += 1;
            }
          } catch (e) {
            return result;
          }
        },
        75,
        {
          resolve(value) {
            expect(value).toBe(1);
            done();
          },
        }
      );
    });

    test('case 9:', (done) => {
      run(
        function* () {
          yield new Promise((_resolve, reject) => reject('Promise Rejected'));
        },
        0,
        {
          reject(reason) {
            expect(reason).toBe('Promise Rejected');
          },
        }
      );

      let start = new Date().getTime();
      run(
        function* () {
          let returnValue: number;
          try {
            yield new Promise((resolve) => setTimeout(resolve, 150, 1));
          } catch (e) {
            // @ts-ignore
            returnValue = yield new Promise((resolve) =>
              setTimeout(resolve, 100, -1)
            );
            return returnValue;
          }
        },
        100,
        {
          resolve(value) {
            expect(value).toBe(-1);
            // 应该在200ms左右
            expect(new Date().getTime() - start + 10).toBeGreaterThanOrEqual(
              200
            );

            done();
          },
        }
      );
    });
  });

  describe('EagerGet test', () => {
    const getValue = (function () {
      let value = 0;
      return async () => {
        await sleep(Math.random());
        return value++;
      };
    })();

    test('case 1:', (done) => {
      const size = 10;
      const getV = eagerGet(getValue);
      let count = 0;
      for (let i = 0; i < size; i++) {
        getV().then((value) => {
          count++;
          expect(value).toBe(i);
          expect(count).toBe(i + 1);
          if (i == size) {
            done();
          }
        });
      }
    });
  });
});
