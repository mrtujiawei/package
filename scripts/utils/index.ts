/**
 * 提供绝对路径
 * @filename: scripts/paths.ts
 * @author: Mr Prince
 * @date: 2022-11-02 15:07:32
 */
import path from 'path';
import { cp } from 'fs/promises';
import { readFile, writeFile } from 'fs/promises';
import defaultConfig, { getPaths } from '../config';

const cwd = process.cwd();

/**
 * 提供相对于 /packages/* 的绝对路径
 */
export const absolutePath = (...paths: string[]) => {
  return path.resolve(cwd, 'packages', ...paths);
};

/**
 * 大驼峰命名
 */
export const upperCamelCase = (str: string) => {
  return str
    .split('-')
    .map((word) => {
      return word[0].toUpperCase() + word.slice(1);
    })
    .join('');
};

export const preparePublish = async (pkg: string) => {
  const paths = getPaths(pkg);
  await cp(paths.source.readme, paths.destination.readme, { force: true });
  const json = JSON.parse((await readFile(paths.source.pkgJSON)).toString());
  Object.assign(json, defaultConfig);
  await writeFile(
    paths.destination.pkgJSON,
    JSON.stringify(json, null, 2)
  );
};

export const updateVersion = async (pkg: string, version: string) => {
  const paths = getPaths(pkg);
  const json = await readFile(paths.source.pkgJSON);
  const config = JSON.parse(json.toString());
  config.version = version;
  await writeFile(paths.source.pkgJSON, JSON.stringify(config, null, 2));
};
