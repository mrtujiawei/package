/**
 * 处理文件上传
 * @filename packages/bin/src/impl/File.ts
 * @author Mr Prince
 * @date 2023-02-09 16:35:52
 */
import fs from 'fs/promises';
import path from 'path';

export const sliceDirctory = path.join(process.cwd(), 'upload');

/**
 * 接收保存文件切片
 */
export async function uploadSlice({
  index,
  hash,
  currentPath,
}: {
  index: number;
  hash: string;
  currentPath: string;
}) {
  const targetDirectory = path.join(sliceDirctory, hash, '/');
  try {
    await fs.stat(targetDirectory);
  } catch {
    await fs.mkdir(targetDirectory, {
      recursive: true,
    });
  }

  fs.rename(currentPath, path.resolve(targetDirectory, `${hash}-${index}`));
}

export async function mergeSlices({
  name,
  hash,
  total,
}: {
  name: string;
  hash: string;
  total: number;
}) {
  const chunksPath = path.join(sliceDirctory, hash, '/');
  const filePath = path.join(sliceDirctory, name);
  const chunks = await fs.readdir(chunksPath);
  await fs.writeFile(filePath, '');
  if (chunks.length == 0 || chunks.length != total) {
    throw new RangeError('slice total not valid');
  }
  for (let i = 0; i < total; i++) {
    await fs.appendFile(
      filePath,
      await fs.readFile(path.resolve(chunksPath, `${hash}-${i}`))
    );
    await fs.unlink(path.resolve(chunksPath, `${hash}-${i}`));
  }
  await fs.rmdir(chunksPath);
}
