import { packArrayBuffer, unpackArrayBuffer } from '../src';

describe('TypedArray test', () => {
  test('wrap & unwrap test', async () => {
    const prefix = 'abc';
    const length = 100;
    const originArrayBuffer = new ArrayBuffer(length);
    const uint16Array = new Uint16Array(originArrayBuffer);

    uint16Array.set(
      Array.from({ length: uint16Array.length }, () =>
        Math.ceil(length * Math.random())
      )
    );
    const newBuffer = packArrayBuffer(uint16Array, prefix);
    const result = unpackArrayBuffer(newBuffer);

    expect(result.prefix).toBe(prefix);

    const newArrayBuffer = new Uint16Array(result.arrayBuffer);
    for (let i = 0; i < uint16Array.length; i++) {
      expect(uint16Array[i]).toBe(newArrayBuffer[i]);
    }
  });
});
