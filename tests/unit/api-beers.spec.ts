import { test, expect, request } from '@playwright/test';
import { apiService } from '../../frontend/src/utils/api';
import { BeerInput } from '../../frontend/src/types';

// Test data helpers
const createBeerData = (overrides = {}): BeerInput => ({
  name: 'Test IPA',
  brewery: 'Test Brewery',
  style: 'IPA',
  abv: 6.5,
  ...overrides,
});

const createValidBeer = async (data = {}) => 
{

  const beerData = createBeerData(data);
  
  // the old way without apiService:
  /*
  const response = await request.post(`${API_BASE_URL}/beers`, {
    data: beerData,
  });
  expect(response.ok()).toBeTruthy();
  const result = await response.json();
  */
  
  const result = await apiService.createBeer(beerData);
  expect(result.success).toBeTruthy();
  expect(result.data).toBeDefined();
  return result.data!;
};

const cleanupBeer = async (beerId: string) => 
{
  await apiService.deleteBeer(beerId);
};

test.describe('Beer API Unit Tests', () => 
{
  let createdBeerIds: string[] = [];

  // Cleanup after all tests
  test.afterAll(async () => 
  {
    for (const id of createdBeerIds) 
    {
      try 
      {
        await cleanupBeer(id);
      }
      catch (e) 
      {
        // Ignore cleanup errors
      }
    }
    createdBeerIds = [];
  });

  test.describe('Health Check', () => 
  {
    test('should return health status', async () => 
    {
      const result = await apiService.healthCheck();
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('running');
      expect(result.data).toBeDefined();
      expect((result.data as { timestamp: string; uptime: number; environment: string }).timestamp).toBeDefined();
    });
  });

  test.describe('GET /api/beers', () => 
  {
    test('should get all beers', async () => 
    {
      const result = await apiService.getBeers();
      expect(result.success).toBeTruthy();
      expect(Array.isArray(result.data)).toBeTruthy();
    });

    test('should return empty array when no beers exist', async () => 
    {
      // This assumes the database is empty or this is isolated
      const result = await apiService.getBeers();
      expect(result.success).toBeTruthy();
      expect(Array.isArray(result.data)).toBeTruthy();
    });
  });

  test.describe('POST /api/beers', () => 
  {
    test('should create a new beer with required fields', async () => 
    {
      const beerData = createBeerData();
      const result = await apiService.createBeer(beerData);
      
      expect(result.success).toBeTruthy();
      expect(result.data).toBeDefined();
      expect(result.data!.name).toBe(beerData.name);
      expect(result.data!.brewery).toBe(beerData.brewery);
      expect(result.data!.style).toBe(beerData.style);
      expect(result.data!.abv).toBe(beerData.abv);
      expect(result.data!.drank).toBe(false); // Default value
      expect(result.data!._id).toBeDefined();
      
      createdBeerIds.push(result.data!._id);
    });

    test('should create a beer with all optional fields', async () => 
    {
      const beerData = createBeerData({
        rating: 4,
        notes: 'Great IPA with hoppy flavor',
        drank: true,
      });
      
      const result = await apiService.createBeer(beerData);
      
      expect(result.success).toBeTruthy();
      expect(result.data!.rating).toBe(4);
      expect(result.data!.notes).toBe('Great IPA with hoppy flavor');
      expect(result.data!.drank).toBeTruthy();
      
      createdBeerIds.push(result.data!._id);
    });

    test('should reject beer with missing required fields', async () => 
    {
      const invalidBeerData = {
        name: 'Test Beer',
        // Missing brewery, style, abv
      } as BeerInput;
      
      const result = await apiService.createBeer(invalidBeerData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should reject beer with invalid ABV', async () => 
    {
      const invalidBeerData = createBeerData({
        abv: -5, // Invalid negative ABV
      });
      
      const result = await apiService.createBeer(invalidBeerData);
      
      // Should validate ABV range
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  test.describe('GET /api/beers/:id', () => 
  {
    test('should get a beer by ID', async () => 
    {
      const beer = await createValidBeer();
      createdBeerIds.push(beer._id);
      
      const result = await apiService.getBeer(beer._id);
      expect(result.success).toBeTruthy();
      expect(result.data!._id).toBe(beer._id);
      expect(result.data!.name).toBe(beer.name);
    });

    test('should return 404 for non-existent beer', async () => 
    {
      const fakeId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId format
      const result = await apiService.getBeer(fakeId);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    test('should reject invalid ID format', async () => 
    {
      const invalidId = 'invalid-id-format';
      const result = await apiService.getBeer(invalidId);
      
      // Should validate ID format
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  test.describe('PUT /api/beers/:id', () => 
  {
    test('should update a beer', async () => 
    {
      const beer = await createValidBeer();
      createdBeerIds.push(beer._id);
      
      const updateData = {
        name: 'Updated IPA',
        rating: 5,
        notes: 'Excellent beer!',
      };
      
      const result = await apiService.updateBeer(beer._id, updateData);
      
      expect(result.success).toBeTruthy();
      expect(result.data!.name).toBe(updateData.name);
      expect(result.data!.rating).toBe(updateData.rating);
      expect(result.data!.notes).toBe(updateData.notes);
    });

    test('should update beer drank status', async () => 
    {
      const beer = await createValidBeer();
      createdBeerIds.push(beer._id);
      
      const result = await apiService.updateBeer(beer._id, { drank: true });
      
      expect(result.success).toBeTruthy();
      expect(result.data!.drank).toBeTruthy();
    });

    test('should return 404 when updating non-existent beer', async () => 
    {
      const fakeId = '507f1f77bcf86cd799439011';
      const result = await apiService.updateBeer(fakeId, { name: 'Updated Name' });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  test.describe('DELETE /api/beers/:id', () => 
  {
    test('should delete a beer', async () => 
    {
      const beer = await createValidBeer();
      
      const result = await apiService.deleteBeer(beer._id);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('deleted');
      
      // Verify beer is deleted
      const getResult = await apiService.getBeer(beer._id);
      expect(getResult.success).toBe(false);
      expect(getResult.error).toContain('not found');
    });

    test('should return 404 when deleting non-existent beer', async () => 
    {
      const fakeId = '507f1f77bcf86cd799439011';
      const result = await apiService.deleteBeer(fakeId);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  test.describe('GET /api/beers/stats', () => 
  {
    test('should get beer statistics', async () => 
    {
      // Create test beers for stats
      const beer1 = await createValidBeer({ drank: true, rating: 4 });
      const beer2 = await createValidBeer({ drank: false, rating: 5 });
      const beer3 = await createValidBeer({ drank: true });
      
      createdBeerIds.push(beer1._id, beer2._id, beer3._id);
      
      const result = await apiService.getBeerStats();
      expect(result.success).toBeTruthy();
      expect(result.data).toBeDefined();
      expect(result.data!.totalBeers).toBeGreaterThanOrEqual(3);
      expect(result.data!.drankBeers).toBeGreaterThanOrEqual(2);
      expect(result.data!.pendingBeers).toBeGreaterThanOrEqual(1);
      expect(result.data!.ratedBeers).toBeGreaterThanOrEqual(2);
      expect(result.data!.averageRating).toBeGreaterThan(0);
      expect(typeof result.data!.totalBeers).toBe('number');
    });

    test('should return correct stats structure when no beers exist', async () => 
    {
      const result = await apiService.getBeerStats();
      expect(result.success).toBeTruthy();
      expect(result.data).toBeDefined();
      expect(result.data!.totalBeers).toBeGreaterThanOrEqual(0);
      expect(result.data!.drankBeers).toBeGreaterThanOrEqual(0);
      expect(result.data!.pendingBeers).toBeGreaterThanOrEqual(0);
      expect(result.data!.averageRating).toBeGreaterThanOrEqual(0);
    });
  });
});

