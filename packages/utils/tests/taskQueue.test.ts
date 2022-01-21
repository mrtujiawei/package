import { TaskQueue } from '../src/index';

describe('TaskQueue test', () => {
  test('TaskQueue should run task in order', () => {
    let result: number[] = [];
    let taskQueue = new TaskQueue({
      timeout: 3000,
      handler(value: any, timeout: number): Promise<void> {
        return new Promise((resolve) => {
          setTimeout(() => {
            result.push(value);
            resolve();
          }, timeout);
        });
      },
    });

    taskQueue.push(1, 100);
    taskQueue.push(2, 50);
    taskQueue.push(3, 0);
    taskQueue.push(4, 20);

    return new Promise((resolve) => {
      setTimeout(() => {
        result.forEach((value, index) => {
          expect(index + 1).toBe(value);
        });
        resolve(void 0);
      }, 200);
    });
  });
});
