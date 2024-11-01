// Import next/jest for seamless Jest configuration with Next.js
const nextJest = require('next/jest');

// Create Jest config using Next.js settings
const createJestConfig = nextJest({
  dir: './', // The path to your Next.js app
});

const customJestConfig = {
  testEnvironment: 'node', // Since you're testing server-side code, use the node environment
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Transform JS/TS files using babel-jest
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // Map module aliases
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'], // Ignore build and dependency folders
};

module.exports = createJestConfig(customJestConfig);