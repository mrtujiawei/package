/**
 * 预览: playground 的devServer
 */
import webpack from 'webpack';
import { Command } from 'commander';
import buildTs from './compilers/ts';
import buildUmd from './compilers/umd';
import buildLess from './compilers/less';
import buildCjs from './compilers/cjs';
import { absolutePath } from './utils';

const program = new Command('build');

interface Options {
  mode: webpack.Configuration['mode'];
  name: string;
}

program
  .requiredOption('--name <pacakgeName>', '需要打包的package')
  .option('--mode <mode>', '打包模式: development | production', 'production')
  .action(async (options: Options) => {
    const packageName = options.name;
    if (packageName == 'bin') {
      buildCjs(packageName);
      return;
    }

    if (packageName == 'node-utils') {
      buildTs();
      await buildCjs(packageName);
      return;
    }

    if (packageName == 'react-components') {
      buildTs();
      buildLess(absolutePath(options.name));
      await buildUmd(packageName);
      return;
    }

    if (packageName == 'utils') {
      buildTs();
      await buildUmd(packageName);
      return;
    }

    if (packageName == 'web-utils') {
      buildTs();
      await buildUmd(packageName);
      return;
    }

    console.log(`[${packageName}]不支持打包`);
  })
  .parse(process.argv);
