/**
 * 预览: playground 的devServer
 */
import fs from 'fs/promises';
import { Command } from 'commander';
import buildTs from './compilers/ts';
import buildLess from './compilers/less';
import { absolutePath } from './utils';

const program = new Command('build');

interface Options {
  name: string;
}

program
  .requiredOption('--name <pacakgeName>', '需要打包的package')
  .option('--mode <mode>', '打包模式: development | production', 'production')
  .action(async (options: Options) => {
    const packageName = options.name;
    if (packageName == 'bin') {
      // buildCjs(packageName);

      const dir = `dist/packages/bin/src`;
      try {
        await fs.stat(dir);
        await fs.rmdir(dir);
      } catch (e) {
        fs.mkdir(dir, { recursive: true });
      }
      await fs.cp('packages/bin/shell', `dist/packages/bin/src/shell`, { recursive: true });
      return;
    }

    if (packageName == 'node-utils') {
      buildTs();
      // await buildCjs(packageName);
      return;
    }

    if (packageName == 'react-components') {
      buildTs();
      buildLess(absolutePath(options.name));
      return;
    }

    if (packageName == 'utils') {
      buildTs();
      return;
    }

    if (packageName == 'web-utils') {
      buildTs();
      return;
    }

    console.log(`[${packageName}]不支持打包`);
  })
  .parse(process.argv);
