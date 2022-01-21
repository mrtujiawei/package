/**
 * 提供最基础的模板
 * 经过修改后才能使用
 *
 * 主要是要添加
 *
 * entry
 * output.path
 *
 * @filename scripts/compilers/cjs/webpack.config.ts
 * @author Mr Prince
 * @date 2022-11-29 16:05:09
 */
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import TerserWebpackPlugin from 'terser-webpack-plugin';

const getConfig = () => {
  const config: webpack.Configuration = {
    mode: 'production',
    // 有错尽快结束
    bail: true,
    // sourcemap配置
    devtool: false,

    // 有警告或错误才显示
    stats: 'errors-warnings',
    output: {
      library: {
        type: 'commonjs',
      },
      filename: `index.cjs.js`,
    },
    target: 'node',
    externalsPresets: {
      node: true,
    },
    module: {
      // 将缺失的导出提示成错误而不是警告
      strictExportPresence: true,
      rules: [
        {
          oneOf: [
            {
              test: /\.(ts|js)x?$/,
              exclude: /(node_modules)/,
              use: {
                loader: 'babel-loader',
                options: {
                  sourceMaps: false,
                  inputSourceMap: false,
                  cacheDirectory: true,
                  cacheCompression: false,
                  presets: ['@babel/preset-typescript'],
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
    },
    externals: [nodeExternals()] as any,
    optimization: {
      minimizer: [
        new TerserWebpackPlugin({
          // 注释不单独生成一个文件
          extractComments: false,
          terserOptions: {
            compress: {
              // webpack 默认 配置为2
              // 没必要压缩两遍
              passes: 1,
            },
            output: {
              // 不生成特殊的注释
              comments: false,
            },
          },
        }),
      ],
    },
  };

  return config;
};

export default getConfig;
