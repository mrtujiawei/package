import fs from 'fs';
import path from 'path';
import { spawn, SpawnOptions, spawnSync } from 'child_process';

const options: SpawnOptions = {
  stdio: 'inherit',
};

const closeEventName = 'close';

/**
 * @param cwd 需要编译的 package 目录
 */
const build = (cwd: string, watch?: boolean) => {
  const command = 'npx';
  // -L 日志详细程度，越少越简单
  const args = [
    'gulp',
    '-LL',
    '--cwd',
    cwd,
    '-f',
    path.resolve(__dirname, './gulpfile.ts'),
  ];
  const watchArg = ['start'];

  if (watch) {
    // 启动 playground 时，可能没有编译过 react-components 的样式
    // 导致引入样式文件报错
    if (!fs.existsSync(path.resolve(cwd, 'dist/styles/index.css'))) {
      build(cwd, false);
    }
    console.log([command].concat(args, watchArg).join(' '));
    const gulp = spawn(command, args.concat(watchArg), options);

    gulp.on(closeEventName, (code) => {
      console.log(`gulp exit with code ${code}`);
    });
  } else {
    console.log([command].concat(args).join(' '));
    spawnSync(command, args, options);
  }
};

export default build;
