# Playwright Tests for Beer Management

This directory contains automated tests for the Beer Management application, organized into unit and integration tests using Playwright.

## Test Structure

```
tests/
├── unit/              # Unit tests for API endpoints
│   └── api-beers.spec.ts
└── integration/       # E2E integration tests for frontend
    └── app.spec.ts
```

## Test Types

### Unit Tests (`tests/unit/`)
- **Purpose**: Test individual API endpoints in isolation
- **Location**: `tests/unit/api-beers.spec.ts`
- **What they test**:
  - Health check endpoint
  - CRUD operations (Create, Read, Update, Delete)
  - Beer statistics endpoint
  - Input validation
  - Error handling
  - Edge cases

### Integration Tests (`tests/integration/`)
- **Purpose**: End-to-end testing of the full application workflow
- **Location**: `tests/integration/app.spec.ts`
- **What they test**:
  - App loading and rendering
  - Form interactions
  - Adding/editing/deleting beers through the UI
  - User workflows
  - Responsive design
  - Error handling in UI

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Start the application:
   ```bash
   # Start database and backend
   npm run start-db
   
   # In another terminal, start frontend
   npm run client
   ```

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests Only
```bash
npm run test:integration
```

### Run Tests with UI Mode (Interactive)
```bash
npm run test:ui
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### View Test Report
```bash
npm run test:report
```

## Test Configuration

Tests are configured in `playwright.config.ts` at the root of the project. The configuration includes:

- **Unit tests**: Use Playwright's API testing capabilities
- **Integration tests**: Run in Chromium, Firefox, and WebKit browsers
- **Base URLs**: 
  - API: `http://localhost:5001/api`
  - Frontend: `http://localhost:5173`

## Writing New Tests

### Adding Unit Tests

Create a new test file in `tests/unit/`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Your Feature', () => {
  test('should do something', async ({ request }) => {
    const response = await request.get('http://localhost:5001/api/your-endpoint');
    expect(response.ok()).toBeTruthy();
  });
});
```

### Adding Integration Tests

Add tests to `tests/integration/app.spec.ts` or create a new spec file:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Your Feature', () => {
  test('should work in the UI', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /your button/i })).toBeVisible();
  });
});
```

## Test Data Management

- Unit tests create test data and clean it up automatically
- Integration tests may rely on existing data or create it as needed
- Consider using test fixtures or database seeding for consistent test environments

## Continuous Integration

These tests can be integrated into CI/CD pipelines. Example GitHub Actions workflow:

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run tests
  run: npm test
```

## Troubleshooting

### Tests fail with connection errors
- Ensure backend is running: `npm run start-db`
- Ensure frontend is running: `npm run client`
- Check that ports 5001 (backend) and 5173 (frontend) are available

### Tests fail with database errors
- Ensure MongoDB is running: `npm run start-db`
- Consider using a separate test database

### Browser not found
- Run `npx playwright install` to install required browsers

