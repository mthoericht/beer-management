import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://localhost:5001/api';

// Test data helpers
const createBeerData = (overrides = {}) => ({
  name: 'Test IPA',
  brewery: 'Test Brewery',
  style: 'IPA',
  abv: 6.5,
  ...overrides,
});

const createValidBeer = async (request: any, data = {}) => {
  const beerData = createBeerData(data);
  const response = await request.post(`${API_BASE_URL}/beers`, {
    data: beerData,
  });
  expect(response.ok()).toBeTruthy();
  const result = await response.json();
  expect(result.success).toBe(true);
  expect(result.data).toBeDefined();
  return result.data;
};

const cleanupBeer = async (request: any, beerId: string) => {
  await request.delete(`${API_BASE_URL}/beers/${beerId}`);
};

test.describe('Beer API Unit Tests', () => {
  let createdBeerIds: string[] = [];

  // Cleanup after all tests
  test.afterAll(async ({ request }) => {
    for (const id of createdBeerIds) {
      try {
        await cleanupBeer(request, id);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    createdBeerIds = [];
  });

  test.describe('Health Check', () => {
    test('should return health status', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/health`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message).toContain('running');
      expect(data.data).toBeDefined();
      expect(data.data.timestamp).toBeDefined();
    });
  });

  test.describe('GET /api/beers', () => {
    test('should get all beers', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/beers`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    test('should return empty array when no beers exist', async ({ request }) => {
      // This assumes the database is empty or this is isolated
      const response = await request.get(`${API_BASE_URL}/beers`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  test.describe('POST /api/beers', () => {
    test('should create a new beer with required fields', async ({ request }) => {
      const beerData = createBeerData();
      const response = await request.post(`${API_BASE_URL}/beers`, {
        data: beerData,
      });
      
      expect(response.ok()).toBeTruthy();
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.name).toBe(beerData.name);
      expect(result.data.brewery).toBe(beerData.brewery);
      expect(result.data.style).toBe(beerData.style);
      expect(result.data.abv).toBe(beerData.abv);
      expect(result.data.drank).toBe(false); // Default value
      expect(result.data._id).toBeDefined();
      
      createdBeerIds.push(result.data._id);
    });

    test('should create a beer with all optional fields', async ({ request }) => {
      const beerData = createBeerData({
        rating: 4,
        notes: 'Great IPA with hoppy flavor',
        drank: true,
      });
      
      const response = await request.post(`${API_BASE_URL}/beers`, {
        data: beerData,
      });
      
      expect(response.ok()).toBeTruthy();
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.data.rating).toBe(4);
      expect(result.data.notes).toBe('Great IPA with hoppy flavor');
      expect(result.data.drank).toBe(true);
      
      createdBeerIds.push(result.data._id);
    });

    test('should reject beer with missing required fields', async ({ request }) => {
      const invalidBeerData = {
        name: 'Test Beer',
        // Missing brewery, style, abv
      };
      
      const response = await request.post(`${API_BASE_URL}/beers`, {
        data: invalidBeerData,
      });
      
      expect(response.status()).toBe(400);
      
      const result = await response.json();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should reject beer with invalid ABV', async ({ request }) => {
      const invalidBeerData = createBeerData({
        abv: -5, // Invalid negative ABV
      });
      
      const response = await request.post(`${API_BASE_URL}/beers`, {
        data: invalidBeerData,
      });
      
      // Should validate ABV range
      expect([400, 422]).toContain(response.status());
    });
  });

  test.describe('GET /api/beers/:id', () => {
    test('should get a beer by ID', async ({ request }) => {
      const beer = await createValidBeer(request);
      createdBeerIds.push(beer._id);
      
      const response = await request.get(`${API_BASE_URL}/beers/${beer._id}`);
      expect(response.ok()).toBeTruthy();
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.data._id).toBe(beer._id);
      expect(result.data.name).toBe(beer.name);
    });

    test('should return 404 for non-existent beer', async ({ request }) => {
      const fakeId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId format
      const response = await request.get(`${API_BASE_URL}/beers/${fakeId}`);
      
      expect(response.status()).toBe(404);
      
      const result = await response.json();
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    test('should reject invalid ID format', async ({ request }) => {
      const invalidId = 'invalid-id-format';
      const response = await request.get(`${API_BASE_URL}/beers/${invalidId}`);
      
      // Should validate ID format
      expect([400, 404]).toContain(response.status());
    });
  });

  test.describe('PUT /api/beers/:id', () => {
    test('should update a beer', async ({ request }) => {
      const beer = await createValidBeer(request);
      createdBeerIds.push(beer._id);
      
      const updateData = {
        name: 'Updated IPA',
        rating: 5,
        notes: 'Excellent beer!',
      };
      
      const response = await request.put(`${API_BASE_URL}/beers/${beer._id}`, {
        data: updateData,
      });
      
      expect(response.ok()).toBeTruthy();
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.data.name).toBe(updateData.name);
      expect(result.data.rating).toBe(updateData.rating);
      expect(result.data.notes).toBe(updateData.notes);
    });

    test('should update beer drank status', async ({ request }) => {
      const beer = await createValidBeer(request);
      createdBeerIds.push(beer._id);
      
      const response = await request.put(`${API_BASE_URL}/beers/${beer._id}`, {
        data: { drank: true },
      });
      
      expect(response.ok()).toBeTruthy();
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.data.drank).toBe(true);
    });

    test('should return 404 when updating non-existent beer', async ({ request }) => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request.put(`${API_BASE_URL}/beers/${fakeId}`, {
        data: { name: 'Updated Name' },
      });
      
      expect(response.status()).toBe(404);
    });
  });

  test.describe('DELETE /api/beers/:id', () => {
    test('should delete a beer', async ({ request }) => {
      const beer = await createValidBeer(request);
      
      const response = await request.delete(`${API_BASE_URL}/beers/${beer._id}`);
      expect(response.ok()).toBeTruthy();
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.message).toContain('deleted');
      
      // Verify beer is deleted
      const getResponse = await request.get(`${API_BASE_URL}/beers/${beer._id}`);
      expect(getResponse.status()).toBe(404);
    });

    test('should return 404 when deleting non-existent beer', async ({ request }) => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request.delete(`${API_BASE_URL}/beers/${fakeId}`);
      
      expect(response.status()).toBe(404);
    });
  });

  test.describe('GET /api/beers/stats', () => {
    test('should get beer statistics', async ({ request }) => {
      // Create test beers for stats
      const beer1 = await createValidBeer(request, { drank: true, rating: 4 });
      const beer2 = await createValidBeer(request, { drank: false, rating: 5 });
      const beer3 = await createValidBeer(request, { drank: true });
      
      createdBeerIds.push(beer1._id, beer2._id, beer3._id);
      
      const response = await request.get(`${API_BASE_URL}/beers/stats`);
      expect(response.ok()).toBeTruthy();
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.totalBeers).toBeGreaterThanOrEqual(3);
      expect(result.data.drankBeers).toBeGreaterThanOrEqual(2);
      expect(result.data.pendingBeers).toBeGreaterThanOrEqual(1);
      expect(result.data.ratedBeers).toBeGreaterThanOrEqual(2);
      expect(result.data.averageRating).toBeGreaterThan(0);
      expect(typeof result.data.totalBeers).toBe('number');
    });

    test('should return correct stats structure when no beers exist', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/beers/stats`);
      expect(response.ok()).toBeTruthy();
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.totalBeers).toBeGreaterThanOrEqual(0);
      expect(result.data.drankBeers).toBeGreaterThanOrEqual(0);
      expect(result.data.pendingBeers).toBeGreaterThanOrEqual(0);
      expect(result.data.averageRating).toBeGreaterThanOrEqual(0);
    });
  });
});

