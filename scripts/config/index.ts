import path from 'path';

const defaultConfig = {
  ['#source']: undefined,
  ['#buildConfig']: undefined,
  ['scripts']: undefined,
  main: 'index.production.js',
  module: 'index.js',
  types: 'index.d.ts',
  files: ['*'],
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/mrtujiawei/package.git',
  },
  author: {
    name: '屠佳伟',
    email: 'tujiawei0512@sina.com',
    url: 'https://github.com/mrtujiawei',
  },
  license: 'MIT',
  bugs: {
    url: 'https://github.com/mrtujiawei/package/issues',
    email: 'tujiawei0512@sina.com',
  },
  homepage: 'https://github.com/mrtujiawei/package#readme',
};

export const getPaths = (pkg: string) => {
  const absolute = (...paths: string[]) => {
    return path.resolve(process.cwd(), ...paths);
  };
  const files = {
    readme: 'README.md',
    pkgJSON: 'package.json',
  };

  const source = {
    readme: absolute(`packages/${pkg}/${files.readme}`),
    pkgJSON: absolute(`packages/${pkg}/${files.pkgJSON}`),
  };

  const destination = {
    dir: absolute(`dist/packages/${pkg}/src/`),
    readme: absolute(`dist/packages/${pkg}/src/${files.readme}`),
    pkgJSON: absolute(`dist/packages/${pkg}/src/${files.pkgJSON}`),
  };

  return {
    source,
    destination,
  };
};

export default defaultConfig;
