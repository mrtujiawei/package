import path from 'path';
import { rmSync } from 'fs';
import { execSync } from 'child_process';
import webpack from 'webpack';

// 执行命令
const runCommand = (command: string) => {
  console.log(`> Run command: ${command}`);
  execSync(command);
};

const removeDir = (dir: string) => {
  console.log(`> rm ${dir}`);
  rmSync(dir, {
    force: true,
    recursive: true,
  });
};

// 清空目录
removeDir('dist');

// 生成ts类型文件
runCommand('npx tsc');

// 生成文档
// runCommand('npx doctoc README.md');

const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'utils.js',
    // node环境使用需要
    globalObject: 'this',
    library: {
      // 全局变量名
      name: 'utils',
      // 支持所有格式
      type: 'umd',
      // 减少一层default
      export: ['default'],
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env'], ['@babel/preset-typescript']],
            plugins: [['@babel/plugin-transform-runtime']],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
};

export default config;
