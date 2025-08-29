import { defineConfig, devices } from "@playwright/test";

const dhcUnauthenticated = {
  name: "dhc-tests-no-auth",
  use: {
    ...devices["Desktop Chrome"],
    storageState: "./.auth/dhcUser.json",
    headless: true,
  },
  testMatch: "tests/dhc.spec.ts",
};

export default defineConfig({
  timeout: 60000,
  testDir: "./tests",
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,
  reporter: "html",
  use: {
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "auth-setup",
      testMatch: "tests/blaze-auth.ts",
    },
    {
      name: "chromium-headless",
      use: {
        ...devices["Desktop Chrome"],
        headless: true,
      },
      testIgnore: ['**/*auth*.ts', '**/*naukri*.ts']
    },
    {
      name: "naukri-tests",
      use: {
        ...devices["Desktop Chrome"],
        headless: false,
      },
      testMatch: "tests/naukri.spec.ts",
    },
    dhcUnauthenticated,
    {
      name: 'blaze-tests',
      use: {
        ...devices['Desktop Chrome'],
        headless: false
      },
      testMatch: 'tests/demo-blaze.spec.ts'
    }
  ],
});
