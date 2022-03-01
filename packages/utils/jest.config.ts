export default {
  // 显示测试信息明细
  verbose: false,
  roots: ['<rootDir>/test'],
  testTimeout: 360000,
  testRegex: 'test/(.+)\\.test\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['test/sorts/*', 'test/algorithm/*'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
