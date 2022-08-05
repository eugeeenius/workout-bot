module.exports = {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['./src/config/jest/global-setup.js'],
  clearMocks: true,
  testMatch: [ "**/__tests__/**/*.test.[jt]s?(x)"]
};
