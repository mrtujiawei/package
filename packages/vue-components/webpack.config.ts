import path from 'path';
import { rmSync } from 'fs';
import { execSync } from 'child_process';
import webpack from 'webpack';
import { VueLoaderPlugin } from 'vue-loader';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

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

runCommand('npx tsc');

function getWebpackConfig(mode: webpack.Configuration['mode']) {
  function isProduction() {
    return 'production' == mode;
  }
  const config: webpack.Configuration = {
    name: mode,
    mode: mode,
    entry: './src/index.ts',
    devtool: isProduction() ? false : 'source-map',
    output: {
      path: path.resolve(__dirname, 'dist/umd/'),
      filename: `index${isProduction() ? '.min' : ''}.js`,
      // node环境使用需要
      globalObject: 'this',
      library: {
        // 全局变量名
        name: 'TVComponents',
        // 支持所有格式
        type: 'umd',
        // 减少一层default
        export: ['default'],
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.(ts|js)x?$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-typescript',
                  {
                    allExtensions: true,
                  },
                ],
                [
                '@babel/preset-env',
                  {
                    forceAllTransforms: true,
                    browserslistEnv: '> 0.01%',
                    modules: false,
                  }
                ]
              ],
              plugins: [
                [
                  '@babel/plugin-transform-runtime',
                  {
                    proposals: true,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `index${isProduction() ? '.min' : ''}.css`,
      }),
      new VueLoaderPlugin(),
    ],
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx', '.vue'],
    },
    externals: {
      vue: 'Vue',
    },
    optimization: {
      minimize: isProduction(),
      minimizer: [
        '...',
        new CssMinimizerPlugin(),
      ],
    },
  };
  return config;
}

export default [
  getWebpackConfig('development'),
  getWebpackConfig('production'),
];
