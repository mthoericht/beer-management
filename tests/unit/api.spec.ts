import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiService } from '../../frontend/src/utils/api';

const mockFetch = vi.fn();

describe('ApiService', () => 
{
  beforeEach(() => 
  {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  describe('getBeers', () => 
  {
    it('should return beers on success', async () => 
    {
      const mockData = { success: true, data: [{ _id: '1', name: 'IPA' }] };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await apiService.getBeers();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData.data);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/beers',
        expect.objectContaining({
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        })
      );
    });

    it('should return error on HTTP failure', async () => 
    {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Not found' }),
      });

      const result = await apiService.getBeers();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not found');
    });

    it('should use data.error when message is missing', async () => 
    {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Validation failed' }),
      });

      const result = await apiService.getBeers();

      expect(result.error).toBe('Validation failed');
    });
  });

  describe('createBeer', () => 
  {
    it('should send POST with JSON body', async () => 
    {
      const beerData = { name: 'IPA', brewery: 'X', style: 'IPA', abv: 5 };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { _id: '1', ...beerData } }),
      });

      await apiService.createBeer(beerData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/beers',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(beerData),
        })
      );
    });
  });

  describe('error handling', () => 
  {
    it('should return error on network failure', async () => 
    {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await apiService.getBeers();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should return unknown error message for non-Error throws', async () => 
    {
      mockFetch.mockRejectedValue('string error');

      const result = await apiService.getBeers();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error occurred');
    });

    it('should return error when response.json fails', async () => 
    {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const result = await apiService.getBeers();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid JSON');
    });
  });

  describe('getBeer', () => 
  {
    it('should call correct endpoint with id', async () => 
    {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { _id: '123' } }),
      });

      await apiService.getBeer('123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/beers/123',
        expect.any(Object)
      );
    });
  });

  describe('updateBeer', () => 
  {
    it('should send PUT with body', async () => 
    {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} }),
      });

      await apiService.updateBeer('123', { name: 'Updated' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/beers/123',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'Updated' }),
        })
      );
    });
  });

  describe('deleteBeer', () => 
  {
    it('should send DELETE request', async () => 
    {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await apiService.deleteBeer('123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/beers/123',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('getBeerStats', () => 
  {
    it('should return stats on success', async () => 
    {
      const mockStats = { totalBeers: 5, drankBeers: 2, pendingBeers: 3, ratedBeers: 4, averageRating: 4.2 };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockStats }),
      });

      const result = await apiService.getBeerStats();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStats);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/beers/stats',
        expect.any(Object)
      );
    });
  });

  describe('healthCheck', () => 
  {
    it('should call health endpoint', async () => 
    {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'running' }),
      });

      const result = await apiService.healthCheck();

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/health',
        expect.any(Object)
      );
    });
  });
});
