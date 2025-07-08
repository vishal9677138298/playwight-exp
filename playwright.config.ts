import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const dhcUnauthenticated = {
      name: 'dhc-tests-no-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './.auth/dhcUser.json',
        headless: false
      },
      testMatch: "tests/dhc.spec.ts",
    };
const dhcAuthenticated = {
  ...dhcUnauthenticated,
  name: 'dhc-tests-authenticated',
  dependencies: ['dhc-auth']
}
export default defineConfig({

  timeout: 60000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'auth-setup',
      testMatch: 'tests/blaze-auth.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
        storageState: './.auth/user.json',
        headless: false,
       },
      dependencies: ['auth-setup']
    },
    {
      name: 'chromium-headless',
      use: { ...devices['Desktop Chrome'],
        storageState: './.auth/user.json',
        headless: true
       },
      dependencies: ['auth-setup']
    },
    {
      name: 'dhc-auth',
      testMatch: "tests/dhc-auth.spec.ts",
      use: {
        ...devices['Desktop Chrome'],
        headless: false
      }
    },
    dhcUnauthenticated,
    dhcAuthenticated
  ],
});
