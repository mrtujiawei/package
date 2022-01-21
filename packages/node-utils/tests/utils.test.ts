import { request } from '../src/index';

test('Test run', async () => {
  const data = await request('https://www.baidu.com');
  expect(data.join('')).toMatch(/百度/);
});

test('Test run', (done) => {
  request('http://a.b.c.d/a/b/c/d')
    .catch(() => {
      expect(1).toBe(1);
    })
    .finally(done);
});
