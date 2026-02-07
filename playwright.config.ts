import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Beer Management application
 * 
 * This configuration includes:
 * - Unit tests: API endpoint testing (tests/unit/)
 * - Integration tests: E2E UI testing (tests/integration/)
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
    // Base URL for API tests
    baseURL: 'http://localhost:5001/api',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
  },

  // Configure projects for different test types
  projects: [
    // API Tests (HTTP requests to backend - requires backend running)
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
      use: {
        baseURL: 'http://localhost:5001/api',
      },
    },

    // Integration/E2E Tests
    {
      name: 'integration',
      testMatch: /integration\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173',
      },
    },

    // Alternative browsers for integration tests
    {
      name: 'integration-firefox',
      testMatch: /integration\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:5173',
      },
    },

    {
      name: 'integration-webkit',
      testMatch: /integration\/.*\.spec\.ts/,
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

