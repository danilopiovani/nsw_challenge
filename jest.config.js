// jest.config.js
module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts'], 
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
  