export default {
  // 显示测试信息明细
  verbose: false,
  roots: [
    '<rootDir>/packages/utils/tests',
    '<rootDir>/packages/node-utils/tests',
  ],
  testTimeout: 360000,
  testRegex: 'tests/(.+)\\.test\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['tests/sorts/*', 'tests/algorithm/*'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
};
