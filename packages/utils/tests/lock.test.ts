import { Lock, } from '../src/index';

describe('Lock test', () => {
  test('Size 0 is invalid', () => {
    expect(() => {
      new Lock(0);
    }).toThrow(Lock.InvalidSizeError);
  });

  test('Scheduling', async () => {
    let order = 0;
    let lock = new Lock();

    // 先用掉所有的执行单元
    lock.lock();

    return new Promise((resolve) => {
      setTimeout(async () => {
        await lock.lock();
        expect(order++).toBe(0);
        lock.unlock();
      }, 20);

      setTimeout(async () => {
        await lock.lock();
        expect(order++).toBe(1);
        lock.unlock();
      }, 40);

      setTimeout(() => {
        lock.unlock();
      }, 60);

      setTimeout(() => {
        // 已经释放所有资源后再次释放
        expect(() => {
          lock.unlock();
        }).toThrow(Lock.InvalidSizeError);
        resolve(void 0);
      }, 80);
    });
  });

  test('Try lock test', () => {
    const lock = new Lock(1);

    // 消耗完资源
    lock.lock();

    // 尝试获取锁但获取失败
    if (lock.tryLock()) {
      expect(0).toBe(1);
    }

    // 补充资源
    lock.unlock();

    // 尝试获取锁，切获取成功
    if (lock.tryLock()) {
      expect(0).toBe(0);
      lock.unlock();
    }
  });

  test('Unlock is deprecated', () => {
    const lock = new Lock(1);
    expect(() => {
      lock.unlock();
    }).toThrow(Lock.InvalidSizeError);
  });

  test('Lock multiple', () => {
    const lock = new Lock();
    const size = 10000;
    for (let i = 0; i < size; i++) {
      lock.lock();
    }

    const values: number[] = [];
    const run = async (value: number) => {
      await lock.lock();
      values.push(value);
      lock.unlock();
    };

    for (let i = 0; i < 100; i++) {
      run(i);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        for (let i = 0; i < size; i++) {
          lock.unlock();
        }
      });
      setTimeout(() => {
        values.forEach((value, index) => {
          expect(value).toBe(index);
        });
        resolve(void 0);
      });
    });
  });
});
