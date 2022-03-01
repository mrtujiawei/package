const path = require('path');
const { execSync } = require('child_process');
const { rmSync } = require('fs');

// 执行命令
const runCommand = (command) => {
  console.log(`> Run command: ${command}`);
  execSync(command);
};

const removeDir = (dir) => {
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

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webUtils.js',
    // node环境使用需要
    globalObject: 'window',
    library: {
      // 全局变量名
      name: 'webUtils',
      // 支持所有格式
      type: 'umd',
      export: 'default',
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
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
  externals: {

  },
};
