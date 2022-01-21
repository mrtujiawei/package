const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
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
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
              ],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};
