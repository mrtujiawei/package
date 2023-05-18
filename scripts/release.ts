/**
 * 发布脚本
 * @filename scripts/publish.ts
 * @author Mr Prince
 * @date 2023-03-24 15:13:30
 */
import fs from 'fs/promises';
import { Command } from 'commander';
import { spawn, spawnSync } from 'child_process';
import { preparePublish, updateVersion } from './utils';
import path from 'path';

const program = new Command('release');

interface Options {
  name: string;
}

program
  .requiredOption('--name <pacakgeName>', '需要发布的package')
  .action(async (options: Options) => {
    const pkg = options.name;
    await preparePublish(pkg);
    const task = spawn('yarn', ['publish', '--no-git-tag-version'], {
      stdio: 'inherit',
      cwd: path.resolve(process.cwd(), `dist/packages/${pkg}/src`),
    });

    return new Promise((resolve, reject) => {
      task.on('close', async (code) => {
        if (code != 0) {
          reject();
          return;
        }
        const packageJSON = `dist/packages/${pkg}/src/package.json`;
        const json = await fs.readFile(packageJSON);
        const version = JSON.parse(json.toString()).version;
        await updateVersion(pkg, version);
        spawnSync(`git add ${packageJSON}`, {
          stdio: 'inherit',
        });
        spawnSync(`git commmit -m feat(${pkg}): v${version}`, {
          stdio: 'inherit',
        });
        resolve();
      });
    });
  })
  .parse(process.argv);
