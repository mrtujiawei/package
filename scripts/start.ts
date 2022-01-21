import { webpack } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import compileLess from './compilers/less';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import getConfig from './compilers/umd/webpack.config';
import { absolutePath } from './utils';

compileLess(absolutePath('react-components'), true);

const config = getConfig('development');
config.entry = absolutePath('playground/src/index');
config.plugins!.push(
  new HTMLWebpackPlugin({
    template: absolutePath('playground/public/index.html'),
  })
);

new WebpackDevServer(
  {
    compress: false,
    historyApiFallback: true,
    static: {
      directory: absolutePath('playground/public'),
      serveIndex: true,
    },
  },
  webpack(config)
).start();
