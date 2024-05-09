/**
 * 字节数组 byte array 相关的操作
 *
 * @filename package/packages/utils/src/typedArray/index.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-05-08 17:30:14
 */

/**
 * metadata.length 占用的位数
 *
 * 由于 Uint8Array 中每个元素最大不超过 255
 * 导致 metadata.length 超过 255 时异常
 */
const COUNT_SIZE = 2;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * 添加额外信息
 *
 * @param arrayBuffer -
 * @param metadata - prefix.length < (1 << 16)
 */
export const packArrayBuffer = (arrayBuffer: ArrayBuffer, metadata: string) => {
  const encodedMetadata = encoder.encode(metadata);
  const uint8Array = new Uint8Array(arrayBuffer);
  const result = new Uint8Array(
    uint8Array.length + encodedMetadata.length + COUNT_SIZE
  );

  for (let i = COUNT_SIZE - 1, length = encodedMetadata.length; i >= 0; i--) {
    result[i] = Math.floor(length % (1 << 8));
    length = Math.floor(length / (1 << 8));
  }

  result.set(encodedMetadata, COUNT_SIZE);
  result.set(uint8Array, encodedMetadata.length + COUNT_SIZE);

  return result.buffer;
};

/**
 * 解析额外信息
 */
export const unpackArrayBuffer = (arrayBuffer: ArrayBuffer) => {
  const uint8Array = new Uint8Array(arrayBuffer);
  let length = 0;

  for (let i = 0; i < COUNT_SIZE; i++) {
    length = length * (1 << 8) + uint8Array[i];
  }

  return {
    metadata: decoder.decode(uint8Array.slice(COUNT_SIZE, COUNT_SIZE + length)),
    arrayBuffer: uint8Array.slice(COUNT_SIZE + length).buffer,
  };
};
