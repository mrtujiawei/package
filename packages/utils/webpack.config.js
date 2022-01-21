const path = require('path')

module.exports = {
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
            presets: [
              [
                '@babel/preset-env',
                // {
                //   corejs: '3.19.1',
                //   useBuiltIns: 'usage',
                //   targets: {
                //     "ie": '6',
                //     "edge": "17",
                //     "firefox": "60",
                //     "chrome": "20",
                //     "safari": "11.1"
                //   }
                // },
              ],
              [
                '@babel/preset-typescript',
              ],
            ],
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
    extensions: ['.tsx', '.ts', '.js'],
  },
};
