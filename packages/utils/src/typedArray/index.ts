/**
 * 字节数组 byte array 相关的操作
 *
 * @filename package/packages/utils/src/typedArray/index.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2024-05-08 17:30:14
 */

/**
 * 添加额外信息
 *
 * @param prefix - prefix.length < (1 << 16)
 */
export const packArrayBuffer = (arrayBuffer: ArrayBuffer, prefix: string) => {
  // 用 Uint16Array 的原因
  // charCodeAt 的范围在 [0, 65535]
  const uint16Array = new Uint16Array(prefix.length + 1);
  uint16Array[0] = prefix.length;

  Object.values(prefix).forEach((ch, i) => {
    uint16Array[i + 1] = ch.charCodeAt(0);
  });

  const dataArray = new Uint16Array(arrayBuffer);

  const result = new Uint16Array(uint16Array.length + dataArray.length);

  result.set(uint16Array, 0);
  result.set(dataArray, uint16Array.length);

  return result.buffer;
};

/**
 * 解析额外信息
 */
export const unpackArrayBuffer = (arrayBuffer: ArrayBuffer) => {
  const uint16Array = new Uint16Array(arrayBuffer);

  let message = new Array<string>(uint16Array[0]);

  for (let i = 0; i < message.length; i++) {
    message[i] = String.fromCharCode(uint16Array[i + 1]);
  }

  return {
    prefix: message.join(''),
    arrayBuffer: uint16Array.slice(message.length + 1).buffer,
  };
};
