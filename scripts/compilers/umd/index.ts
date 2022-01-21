import getConfig from './webpack.config';
import { absolutePath, upperCamelCase } from '../../utils';
import { webpack } from 'webpack';
import { getPaths } from '../../config';

const build = (pkgName: string) => {
  const config = getConfig('production');
  config.entry = absolutePath(pkgName, 'src/index');
  config.output = {
    ...config.output!,
    path: getPaths(pkgName).destination.dir,
    library: {
      name: `T${upperCamelCase(pkgName)}`,
      type: 'umd',
      // export: 'default',
    },
  };

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
