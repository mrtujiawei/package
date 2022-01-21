module.exports = {
  roots: [
    '<rootDir>/test'
  ],
  testRegex: 'test/(.+)\\.test\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['test/sorts/*', 'test/algorithm/*'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
