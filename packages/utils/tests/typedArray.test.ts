import { packArrayBuffer, unpackArrayBuffer } from '../src';

describe('TypedArray test', () => {
  test('wrap & unwrap test', async () => {
    const metadata = 'abc';
    const length = 100;
    const originArrayBuffer = new ArrayBuffer(length);
    const uint8Array = new Uint8Array(originArrayBuffer);

    uint8Array.set(
      Array.from({ length: uint8Array.length }, () =>
        Math.ceil(length * Math.random())
      )
    );
    const newBuffer = packArrayBuffer(uint8Array, metadata);
    const result = unpackArrayBuffer(newBuffer);

    expect(result.metadata).toBe(metadata);

    const newArrayBuffer = new Uint8Array(result.arrayBuffer);
    for (let i = 0; i < uint8Array.length; i++) {
      expect(uint8Array[i]).toBe(newArrayBuffer[i]);
    }
  });
});
