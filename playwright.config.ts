import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

// End-to-end tests run against a separate *_test database.
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://swee:swee@localhost:5432/swee_test';

export default defineConfig({
  testDir: './e2e',
  // Tests share one database, so run them one at a time.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Optional: point at a preinstalled Chromium instead of Playwright's download.
        launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH },
      },
    },
  ],
  webServer: {
    command: `npx next build && npx next start --port ${PORT}`,
    // Wait on a route that doesn't need the database: global setup prepares
    // the test database only after the server is up.
    url: `${baseURL}/api/health`,
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL: TEST_DATABASE_URL,
      BETTER_AUTH_URL: baseURL,
      BETTER_AUTH_SECRET: 'e2e-only-secret-0123456789abcdef0123456789',
    },
  },
});
