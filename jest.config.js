module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  bail: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/*',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/__tests__/**/*',
    '!src/database/migrations/**',
  ],
};
