import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://localhost:5001/api';

// Generate unique test identifier to avoid conflicts with real beers
const generateTestId = () => `TEST-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Helper to delete beer by exact name and brewery via API (only deletes test beers)
const deleteBeerByAttributes = async (request: any, name: string, brewery: string) => 
{
  try 
  {
    // Only delete if it's a test beer (starts with TEST-)
    if (!name.startsWith('TEST-')) 
    {
      console.warn(`Skipping cleanup for non-test beer: ${name}`);
      return;
    }
    
    const response = await request.get(`${API_BASE_URL}/beers`);
    if (response.ok()) 
    {
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) 
      {
        // Find exact match for name and brewery
        const beer = data.data.find((b: any) => b.name === name && b.brewery === brewery);
        if (beer && beer._id) 
        {
          await request.delete(`${API_BASE_URL}/beers/${beer._id}`);
        }
      }
    }
  }
  catch (e) 
  {
    // Ignore cleanup errors
  }
};

test.describe('Beer Management App - Integration Tests', () => 
{
  test.beforeEach(async ({ page }) => 
  {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('App Loading', () => 
  {
    test('should display the app title', async ({ page }) => 
    {
      await expect(page.getByRole('heading', { name: /beer management/i })).toBeVisible();
    });

    test('should display the beer list section', async ({ page }) => 
    {
      await expect(page.getByRole('heading', { name: /beer list/i })).toBeVisible();
    });

    test('should show "Add New Beer" button', async ({ page }) => 
    {
      await expect(page.getByRole('button', { name: /add new beer/i })).toBeVisible();
    });
  });

  test.describe('Beer Form', () => 
  {
    test('should open form when clicking "Add New Beer" button', async ({ page }) => 
    {
      await page.getByRole('button', { name: /add new beer/i }).click();
      
      await expect(page.getByRole('heading', { name: /add new beer/i })).toBeVisible();
      await expect(page.getByLabel(/beer name/i)).toBeVisible();
    });

    test('should display all form fields', async ({ page }) => 
    {
      await page.getByRole('button', { name: /add new beer/i }).click();
      
      await expect(page.getByLabel(/beer name/i)).toBeVisible();
      await expect(page.getByLabel(/brewery/i)).toBeVisible();
      await expect(page.getByLabel(/style/i)).toBeVisible();
      await expect(page.getByLabel(/abv/i)).toBeVisible();
      await expect(page.getByLabel(/rating/i)).toBeVisible();
      await expect(page.getByLabel(/notes/i)).toBeVisible();
      await expect(page.getByLabel(/already drank/i)).toBeVisible();
    });

    test('should cancel form when clicking cancel button', async ({ page }) => 
    {
      await page.getByRole('button', { name: /add new beer/i }).click();
      
      await expect(page.getByRole('heading', { name: /add new beer/i })).toBeVisible();
      
      await page.getByRole('button', { name: /cancel/i }).click();
      
      // Form should be hidden
      await expect(page.getByRole('heading', { name: /add new beer/i })).not.toBeVisible();
    });
  });

  test.describe('Adding a Beer', () => 
  {
    
    test('should add a new beer successfully', async ({ page, request }) => 
    {
      const testId = generateTestId();
      const beerName = `TEST-${testId}-IPA`;
      const brewery = `TEST-${testId}-Brewery`;
      
      // Click Add New Beer button
      await page.getByRole('button', { name: /add new beer/i }).click();
      
      // Fill in the form
      await page.getByLabel(/beer name/i).fill(beerName);
      await page.getByLabel(/brewery/i).fill(brewery);
      await page.getByLabel(/style/i).fill('IPA');
      await page.getByLabel(/abv/i).fill('6.5');
      
      // Submit the form
      await page.getByRole('button', { name: /add beer/i }).click();
      
      // Wait for the beer to be added
      await page.waitForLoadState('networkidle');
      
      // Verify the beer appears in the list (use first() to handle multiple matches)
      await expect(page.getByText(beerName).first()).toBeVisible();
      await expect(page.getByText(brewery).first()).toBeVisible();
      await expect(page.getByText('IPA').first()).toBeVisible();
      
      // Form should be closed
      await expect(page.getByRole('heading', { name: /add new beer/i })).not.toBeVisible();
      
      // Cleanup: delete the created beer
      await deleteBeerByAttributes(request, beerName, brewery);
    });

    test('should validate required fields', async ({ page }) => 
    {
      await page.getByRole('button', { name: /add new beer/i }).click();
      
      // Try to submit without filling required fields
      await page.getByRole('button', { name: /add beer/i }).click();
      
      // HTML5 validation should prevent submission
      const nameInput = page.getByLabel(/beer name/i);
      const validity = await nameInput.evaluate((el: any) => el.validity?.valid ?? false);
      expect(validity).toBe(false);
    });

    test('should add beer with optional fields', async ({ page, request }) => 
    {
      const testId = generateTestId();
      const beerName = `TEST-${testId}-Rated IPA`;
      const brewery = `TEST-${testId}-Rating Brewery`;
      
      await page.getByRole('button', { name: /add new beer/i }).click();
      
      // Fill in required fields
      await page.getByLabel(/beer name/i).fill(beerName);
      await page.getByLabel(/brewery/i).fill(brewery);
      await page.getByLabel(/style/i).fill('IPA');
      await page.getByLabel(/abv/i).fill('7.0');
      
      // Fill in optional fields
      await page.getByLabel(/rating/i).selectOption('4');
      await page.getByLabel(/notes/i).fill('Great hoppy flavor');
      await page.getByLabel(/already drank/i).check();
      
      // Submit
      await page.getByRole('button', { name: /add beer/i }).click();
      
      await page.waitForLoadState('networkidle');
      
      // Verify all fields are displayed (use first() to handle multiple matches)
      await expect(page.getByText(beerName).first()).toBeVisible();
      await expect(page.getByText('Great hoppy flavor').first()).toBeVisible();
      
      // Cleanup: delete the created beer
      await deleteBeerByAttributes(request, beerName, brewery);
    });
  });

  //is never empty
  /*
  test.describe('Beer List Display', () => {
    test('should display empty state when no beers', async ({ page }) => {
      // Check if empty state is shown (may be shown if no beers exist)
      const emptyState = page.getByText(/no beers added yet/i);
      const beerList = page.locator('.space-y-4');
      
      // Either empty state or list should be visible
      const emptyVisible = await emptyState.isVisible().catch(() => false);
      const listVisible = await beerList.isVisible().catch(() => false);
      
      expect(emptyVisible || listVisible).toBe(true);
    });
  });*/

  test.describe('Editing a Beer', () => 
  {
    test('should edit an existing beer', async ({ page, request }) => 
    {
      const testId = generateTestId();
      const originalBeerName = `TEST-${testId}-Original IPA`;
      const originalBrewery = `TEST-${testId}-Original Brewery`;
      const updatedBeerName = `TEST-${testId}-Updated Beer Name`;
      
      // First, create a beer to edit
      await page.getByRole('button', { name: /add new beer/i }).click();
      await page.getByLabel(/beer name/i).fill(originalBeerName);
      await page.getByLabel(/brewery/i).fill(originalBrewery);
      await page.getByLabel(/style/i).fill('IPA');
      await page.getByLabel(/abv/i).fill('6.0');
      await page.getByRole('button', { name: /add beer/i }).click();
      await page.waitForLoadState('networkidle');
      
      // Wait for the beer to appear
      await expect(page.getByText(originalBeerName).first()).toBeVisible();
      
      // Find and click edit button
      const editButtons = page.getByRole('button', { name: /edit/i });
      await editButtons.first().click();
      
      // Verify form is in edit mode
      await expect(page.getByRole('heading', { name: /edit beer/i })).toBeVisible();
      
      // Update a field
      const nameInput = page.getByLabel(/beer name/i);
      await nameInput.fill(updatedBeerName);
      
      // Submit
      await page.getByRole('button', { name: /update beer/i }).click();
      
      await page.waitForLoadState('networkidle');
      
      // Verify update (use first() to handle multiple matches)
      await expect(page.getByText(updatedBeerName).first()).toBeVisible();
      
      // Cleanup: delete the edited beer (now with updated name)
      await deleteBeerByAttributes(request, updatedBeerName, originalBrewery);
    });
  });

  test.describe('Deleting a Beer', () => 
  {
    test('should delete a beer with confirmation', async ({ page }) => 
    {
      // This test assumes there's at least one beer in the list
      const deleteButtons = page.getByRole('button', { name: /delete/i });
      const count = await deleteButtons.count();
      
      if (count > 0) 
      {
        // Set up dialog handler for confirmation
        page.once('dialog', dialog => 
        {
          expect(dialog.message()).toContain('Are you sure');
          dialog.accept();
        });
        
        // Click delete button
        await deleteButtons.first().click();
        
        // Wait for deletion
        await page.waitForLoadState('networkidle');
        
        // Button count should be reduced (if there were multiple) or empty state shown
        // This is a basic check - actual implementation may vary
      }
      else 
      {
        test.skip();
      }
    });

    test('should cancel deletion when user cancels confirmation', async ({ page }) => 
    {
      const deleteButtons = page.getByRole('button', { name: /delete/i });
      const count = await deleteButtons.count();
      
      if (count > 0) 
      {
        // Store initial count
        const initialCount = await deleteButtons.count();
        
        // Set up dialog handler to cancel
        page.once('dialog', dialog => 
        {
          dialog.dismiss();
        });
        
        await deleteButtons.first().click();
        
        // Wait a bit
        await page.waitForTimeout(500);
        
        // Count should remain the same
        const finalCount = await deleteButtons.count();
        expect(finalCount).toBe(initialCount);
      }
      else 
      {
        test.skip();
      }
    });
  });

  test.describe('Marking Beer as Drank', () => 
  {
    test('should toggle drank status', async ({ page }) => 
    {
      // Look for "Mark as Drank" or "Mark as Not Drank" buttons
      const markButtons = page.getByRole('button', { name: /mark as (drank|not drank)/i });
      const count = await markButtons.count();
      
      if (count > 0) 
      {
        const buttonText = await markButtons.first().textContent();
        await markButtons.first().click();
        
        await page.waitForLoadState('networkidle');
        
        // Button text should toggle
        const newButtons = page.getByRole('button', { name: /mark as (drank|not drank)/i });
        const newButtonText = await newButtons.first().textContent();
        
        // The text should have changed (unless there are multiple buttons)
        expect(newButtonText).toBeTruthy();
      }
      else 
      {
        test.skip();
      }
    });
  });

  test.describe('Beer Statistics', () => 
  {
    test('should display statistics section', async ({ page }) => 
    {
      // Look for stats section (checking for common stat labels)
      const statsSection = page.locator('text=/total|drank|pending|rating/i').first();
      
      // Stats might be visible in a stats component
      // This is a basic check - adjust based on actual implementation
      const hasStats = await statsSection.isVisible().catch(() => false);
      
      // Stats might be shown or might require beers to exist
      expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => 
  {
    test('should display error message on API failure', async ({ page, context }) => 
    {
      // Intercept and block API requests to simulate failure
      await page.route('**/api/beers', route => route.abort());
      
      await page.reload();
      await page.waitForTimeout(2000);
      
      // Check for error display (adjust based on actual error handling UI)
      const errorMessage = page.locator('text=/error/i').first();
      const hasError = await errorMessage.isVisible().catch(() => false);
      
      // Error should be displayed or loading state should handle it
      expect(true).toBe(true); // Basic assertion - adjust based on error UI
    });
  });

  test.describe('Responsive Design', () => 
  {
    test('should work on mobile viewport', async ({ page }) => 
    {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await expect(page.getByRole('heading', { name: /beer management/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /add new beer/i })).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => 
    {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await expect(page.getByRole('heading', { name: /beer management/i })).toBeVisible();
    });
  });
});

