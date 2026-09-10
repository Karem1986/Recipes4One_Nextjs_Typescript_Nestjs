/**
 * Two projects on purpose.
 *
 * `unit` covers the domain layer: no Nest, no HTTP, no database. It is fast because
 * the domain has no framework imports — that speed is the payoff for the architecture.
 *
 * `integration` is for everything that needs Nest wired up. Empty for now.
 */
module.exports = {
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      rootDir: '<rootDir>/src/domain',
      testMatch: ['**/*.spec.ts'],
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'node',
      rootDir: '<rootDir>/src',
      testMatch: ['**/*.integration-spec.ts'],
    },
  ],
};
