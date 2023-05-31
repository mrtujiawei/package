/**
 * FileRender 相关的工具函数
 *
 * blob 转换成 Text | DataURL | ArrayBuffer
 *
 * @filename packages/web-utils/src/utils/fileReader.ts
 * @author Mr Prince
 * @date 2023-05-31 15:34:51
 */

enum ResultType {
  TEXT = 'Text',
  DATA_URL = 'DataURL',
  ARRAY_BUFFER = 'ArrayBuffer',
}

type Result<T> = T extends ResultType.ARRAY_BUFFER ? ArrayBuffer : 'string';

const read = <T extends ResultType>(blob: Blob, type: T) => {
  return new Promise<Result<T>>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reader.onabort = () => {
      reject(reader.error);
    };
    reader.onload = () => {
      resolve(reader.result as Result<T>);
    };
    reader[`readAs${type as ResultType}`](blob);
  });
};

export const readAsText = (blob: Blob) => read(blob, ResultType.TEXT);

export const readAsDataURL = (blob: Blob) => read(blob, ResultType.DATA_URL);

export const readAsArrayBuffer = (blob: Blob) =>
  read(blob, ResultType.ARRAY_BUFFER);
