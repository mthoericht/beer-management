import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Beer Management application
 *
 * - Unit tests: Vitest (tests/unit/) - no Playwright
 * - Integration tests: API tests against backend (tests/integration/)
 * - E2E tests: Browser UI tests (tests/e2e/)
 */
export default defineConfig({
  testDir: './tests',
  
  // Test timeout
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  // Shared settings for all projects
  use: {
    baseURL: 'http://localhost:5001/api',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Configure projects for different test types
  projects: [
    // Integration: API tests (HTTP requests to backend - requires backend running)
    {
      name: 'integration',
      testMatch: /integration\/.*\.spec\.ts/,
      use: {
        baseURL: 'http://localhost:5001/api',
      },
    },

    // E2E: Browser UI tests (requires frontend + backend running)
    {
      name: 'e2e-chrome',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173',
      },
    },

    {
      name: 'e2e-firefox',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:5173',
      },
    },

    {
      name: 'e2e-webkit',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Safari'],
        baseURL: 'http://localhost:5173',
      },
    },
  ],

  // Run the local dev server before starting tests (optional)
  // webServer: [
  //   {
  //     command: 'cd backend && npm run dev',
  //     url: 'http://localhost:5001/api/health',
  //     reuseExistingServer: !process.env.CI,
  //   },
  //   {
  //     command: 'cd frontend && npm run dev',
  //     url: 'http://localhost:5173',
  //     reuseExistingServer: !process.env.CI,
  //   },
  // ],
});

