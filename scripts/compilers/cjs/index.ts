/**
 * 编译 cjs 代码
 * @filename scripts/compilers/cjs/index.ts
 * @author Mr Prince
 * @date 2022-11-25 21:22:50
 */
import getConfig from './webpack.config';
import { absolutePath } from '../../utils';
import { webpack } from 'webpack';
import ShebangWebpackPlugin from './ShebangWebpackPlugin';

const build = (packageName: string) => {
  const config = getConfig();
  config.entry = absolutePath(packageName, 'src/index');
  config.output = {
    ...config.output!,
    path: absolutePath(packageName, 'dist/'),
  };

  if (packageName == 'bin') {
    config.plugins = [new ShebangWebpackPlugin()];
  }

  return new Promise((resolve) => {
    const compiler = webpack(config);
    compiler.run((_err, result) => {
      console.log(_err || result?.toString());
      resolve(_err || result);
      compiler.close((err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });
};

export default build;
