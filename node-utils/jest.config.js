module.exports = {
  roots: ['<rootDir>/test'],
  testRegex: 'test/(.+)\\.test\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: [],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};
