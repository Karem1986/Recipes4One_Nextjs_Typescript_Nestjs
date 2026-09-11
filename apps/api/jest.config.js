/**
 * Two projects on purpose.
 *
 * `unit` covers the domain and application layers: no Nest, no HTTP, no database.
 * It is fast because those layers have no framework imports -- that speed is the
 * payoff for the architecture.
 *
 * `integration` boots the real Nest app and talks to it over HTTP.
 *
 * The npm scripts run Jest with `--experimental-vm-modules`: NestJS 12 ships as ES
 * modules, and Jest can only load those with that Node flag. Run tests through
 * `npm test` / `npm run test:watch`, not a bare `npx jest`.
 */
module.exports = {
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      rootDir: '<rootDir>/src',
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
