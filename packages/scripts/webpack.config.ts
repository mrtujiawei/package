/**
 * 编译 react项目用
 *
 * @filename: packages/scripts/src/react-builder.ts
 * @author: Mr Prince
 * @date: 2022-11-23 11:45:59
 */
import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

type Rules = webpack.RuleSetUseItem[];

const absolutePath = (...paths: string[]) => {
  return path.resolve(process.cwd(), ...paths);
};

const getStyleLoaders = (...loaders: Rules): Rules => {
  return [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          config: false,
          plugins: ['autoprefixer', 'postcss-preset-env'],
        },
      },
    },
    ...loaders,
  ];
};

const WARN_FILE_SIZE = 5 * 1024 * 1024;
const DATA_URL_CONDITION_MAX_SIZE = 10000;

const getConfig = (mode: webpack.Configuration['mode']) => {
  const isEnvProduction = 'production' == mode;

  const config: webpack.Configuration = {
    mode,
    bail: isEnvProduction,
    stats: 'errors-warnings',
    devtool: !isEnvProduction && 'source-map',
    entry: absolutePath('src/index'),
    output: {
      path: absolutePath('build'),
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].chunk.js',
      assetModuleFilename: 'media/[name].[hash][ext]',
      // TODO 动态
      publicPath: '/',
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserWebpackPlugin({
          extractComments: false,
          terserOptions: {
            parse: {
              ecma: 2019,
            },
            compress: {
              comparisons: false,
              ecma: 5,
              inline: 2,
              passes: 1,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
    },
    module: {
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
                  sourceMaps: !isEnvProduction,
                  inputSourceMap: !isEnvProduction,
                  cacheDirectory: true,
                  cacheCompression: false,
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'usage',
                        corejs: '3.19.1',
                      },
                    ],
                    [
                      '@babel/preset-react',
                      {
                        runtime: 'automatic',
                      },
                    ],
                    '@babel/preset-typescript',
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
              use: getStyleLoaders(),
            },
            {
              test: /\.less$/,
              use: getStyleLoaders({
                loader: 'less-loader',
                options: {
                  lessOptions: {
                    javascriptEnabled: true,
                  },
                  sourceMap: true,
                },
              }),
            },
            {
              test: /\.s(a|c)ss$/,
              use: getStyleLoaders({
                loader: 'sass-loader',
                options: {
                  lessOptions: {
                    javascriptEnabled: true,
                  },
                  sourceMap: true,
                },
              }),
            },
            {
              test: [/\.avif$/],
              type: 'asset',
              mimetype: 'image/avif',
              parser: {
                dataUrlCondition: {
                  maxSize: DATA_URL_CONDITION_MAX_SIZE,
                },
              },
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: DATA_URL_CONDITION_MAX_SIZE,
                },
              },
            },
            {
              test: /\.svg$/,
              use: [
                {
                  loader: '@svgr/webpack',
                  options: {
                    prettier: false,
                    svgo: false,
                    svgoConfig: {
                      plugins: [{ removeViewBox: false }],
                    },
                    titleProp: true,
                    ref: true,
                  },
                },
                {
                  loader: 'file-loader',
                  options: {
                    name: 'media/[name].[hash].[ext]',
                  },
                },
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },
            {
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: absolutePath('public/index.html'),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
        templateParameters: {
          // TODO 动态
          title: '我的标题',
        },
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      }),
    ],
    externals: isEnvProduction
      ? {
          react: 'React',
          'react-dom': 'ReactDOM',
        }
      : [],
    performance: {
      maxEntrypointSize: WARN_FILE_SIZE,
      maxAssetSize: WARN_FILE_SIZE,
    },
  };

  return config;
};

export default getConfig('production');
