module.exports = {
  roots: ['<rootDir>/test'],
  testTimeout: 60000,
  testRegex: 'test/(.+)\\.test\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['test/sorts/*', 'test/algorithm/*'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
