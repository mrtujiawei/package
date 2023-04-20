/**
 * 池化
 * @filename packages/utils/src/utils/Pooling.ts
 * @author Mr Prince
 * @date 2023-03-24 10:03:49
 */
import Lock from './Lock';
import { requestTimeout } from './asyncUtils';

export const createPool = <T>(options: {
  minSize: number;
  maxSize: number;
  create: () => T;
  timeout: number;
}) => {
  const pool: T[] = [];
  const lock = new Lock(options.maxSize);
  let size = options.minSize;
  while (pool.length < options.minSize) {
    pool.push(options.create());
  }

  for (let i = options.minSize; i < options.maxSize; i++) {
    lock.lock();
  }

  const checkSize = () => {
    if (0 == pool.length && size < options.maxSize) {
      pool.push(options.create());
      lock.unlock();
    }
  };

  return {
    async getResource(): Promise<T> {
      return requestTimeout<T>(
        async () => {
          checkSize();
          await lock.lock();
          return pool.pop()!;
        },
        options.timeout,
        (value) => {
          pool.push(value);
          lock.unlock();
        }
      );
    },
    returnResource(resource: T) {
      pool.push(resource);
      lock.unlock();
    },
    free(destory: (resource: T) => void) {
      while (size > options.minSize && pool.length > 0) {
        const resource = pool.pop()!;
        destory(resource);
        size--;
        lock.lock();
      }
    },
  };
};

export default createPool;
