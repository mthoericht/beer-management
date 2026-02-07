import { describe, it, expect } from 'vitest';
import { BeerStatsHelper } from '../../frontend/src/utils/beerStatsHelper';
import type { Beer } from '../../frontend/src/types/BeerInterfaces';

const createBeer = (overrides: Partial<Beer> = {}): Beer => ({
  _id: 'test-id',
  name: 'Test Beer',
  brewery: 'Test Brewery',
  style: 'IPA',
  abv: 6.5,
  drank: false,
  dateAdded: '2024-01-01',
  ...overrides,
});

describe('BeerStatsHelper', () => 
{
  describe('countTotalBeers', () => 
  {
    it('should return 0 for empty array', () => 
    {
      expect(BeerStatsHelper.countTotalBeers([])).toBe(0);
    });

    it('should return correct count', () => 
    {
      const beers = [createBeer(), createBeer(), createBeer()];
      expect(BeerStatsHelper.countTotalBeers(beers)).toBe(3);
    });
  });

  describe('countDrankBeers', () => 
  {
    it('should return 0 when no beers are drank', () => 
    {
      const beers = [createBeer(), createBeer({ drank: false })];
      expect(BeerStatsHelper.countDrankBeers(beers)).toBe(0);
    });

    it('should return correct count of drank beers', () => 
    {
      const beers = [
        createBeer({ drank: true }),
        createBeer({ drank: false }),
        createBeer({ drank: true }),
      ];
      expect(BeerStatsHelper.countDrankBeers(beers)).toBe(2);
    });

    it('should return total when all are drank', () => 
    {
      const beers = [createBeer({ drank: true }), createBeer({ drank: true })];
      expect(BeerStatsHelper.countDrankBeers(beers)).toBe(2);
    });
  });

  describe('countPendingBeers', () => 
  {
    it('should return total when none are drank', () => 
    {
      const beers = [createBeer(), createBeer()];
      expect(BeerStatsHelper.countPendingBeers(beers)).toBe(2);
    });

    it('should return 0 when all are drank', () => 
    {
      const beers = [createBeer({ drank: true }), createBeer({ drank: true })];
      expect(BeerStatsHelper.countPendingBeers(beers)).toBe(0);
    });

    it('should return correct mixed count', () => 
    {
      const beers = [
        createBeer({ drank: true }),
        createBeer({ drank: false }),
        createBeer({ drank: false }),
      ];
      expect(BeerStatsHelper.countPendingBeers(beers)).toBe(2);
    });
  });

  describe('countRatedBeers', () => 
  {
    it('should return 0 when no beers have rating', () => 
    {
      const beers = [createBeer(), createBeer()];
      expect(BeerStatsHelper.countRatedBeers(beers)).toBe(0);
    });

    it('should exclude beers with rating 0', () => 
    {
      const beers = [createBeer({ rating: 0 }), createBeer({ rating: 4 })];
      expect(BeerStatsHelper.countRatedBeers(beers)).toBe(1);
    });

    it('should count beers with valid rating', () => 
    {
      const beers = [
        createBeer({ rating: 4 }),
        createBeer({ rating: 5 }),
        createBeer({ rating: undefined }),
      ];
      expect(BeerStatsHelper.countRatedBeers(beers)).toBe(2);
    });
  });

  describe('calculateAverageRating', () => 
  {
    it('should return 0 for empty array', () => 
    {
      expect(BeerStatsHelper.calculateAverageRating([])).toBe(0);
    });

    it('should return 0 when no beers are rated', () => 
    {
      const beers = [createBeer(), createBeer()];
      expect(BeerStatsHelper.calculateAverageRating(beers)).toBe(0);
    });

    it('should calculate correct average', () => 
    {
      const beers = [createBeer({ rating: 4 }), createBeer({ rating: 5 })];
      expect(BeerStatsHelper.calculateAverageRating(beers)).toBe(4.5);
    });

    it('should round to specified decimals', () => 
    {
      const beers = [createBeer({ rating: 4 }), createBeer({ rating: 5 })];
      expect(BeerStatsHelper.calculateAverageRating(beers, 2)).toBe(4.5);
    });

    it('should ignore unrated beers', () => 
    {
      const beers = [
        createBeer({ rating: 4 }),
        createBeer({ rating: undefined }),
        createBeer({ rating: 5 }),
      ];
      expect(BeerStatsHelper.calculateAverageRating(beers)).toBe(4.5);
    });
  });

  describe('calculateAverageABV', () => 
  {
    it('should return 0 for empty array', () => 
    {
      expect(BeerStatsHelper.calculateAverageABV([])).toBe(0);
    });

    it('should calculate correct average', () => 
    {
      const beers = [createBeer({ abv: 5 }), createBeer({ abv: 7 })];
      expect(BeerStatsHelper.calculateAverageABV(beers)).toBe(6);
    });

    it('should round to specified decimals', () => 
    {
      const beers = [createBeer({ abv: 5 }), createBeer({ abv: 6 })];
      expect(BeerStatsHelper.calculateAverageABV(beers, 1)).toBe(5.5);
    });
  });

  describe('getUniqueStyles', () => 
  {
    it('should return empty array for empty input', () => 
    {
      expect(BeerStatsHelper.getUniqueStyles([])).toEqual([]);
    });

    it('should return unique styles', () => 
    {
      const beers = [
        createBeer({ style: 'IPA' }),
        createBeer({ style: 'IPA' }),
        createBeer({ style: 'IPA' }),
        createBeer({ style: 'Lager' }),
      ];
      expect(BeerStatsHelper.getUniqueStyles(beers)).toEqual(['IPA', 'Lager']);
    });
  });

  describe('getUniqueBreweries', () => 
  {
    it('should return unique breweries', () => 
    {
      const beers = [
        createBeer({ brewery: 'Brewery A' }),
        createBeer({ brewery: 'Brewery A' }),
        createBeer({ brewery: 'Brewery B' }),
      ];
      expect(BeerStatsHelper.getUniqueBreweries(beers)).toEqual(['Brewery A', 'Brewery B']);
    });
  });

  describe('findTopStyle', () => 
  {
    it('should return undefined for empty array', () => 
    {
      expect(BeerStatsHelper.findTopStyle([], 0)).toBeUndefined();
    });

    it('should return top style by count', () => 
    {
      const beers = [
        createBeer({ style: 'IPA' }),
        createBeer({ style: 'IPA' }),
        createBeer({ style: 'IPA' }),
        createBeer({ style: 'Lager' }),
      ];
      const result = BeerStatsHelper.findTopStyle(beers, 4);
      expect(result).toEqual({
        style: 'IPA',
        count: 3,
        percentage: 75,
      });
    });
  });

  describe('findTopBrewery', () => 
  {
    it('should return top brewery by count', () => 
    {
      const beers = [
        createBeer({ brewery: 'Brewery A' }),
        createBeer({ brewery: 'Brewery A' }),
        createBeer({ brewery: 'Brewery B' }),
      ];
      const result = BeerStatsHelper.findTopBrewery(beers, 3);
      expect(result).toEqual({
        brewery: 'Brewery A',
        count: 2,
        percentage: (2 / 3) * 100,
      });
    });
  });

  describe('countByCategory', () => 
  {
    it('should count by style', () => 
    {
      const beers = [
        createBeer({ style: 'IPA' }),
        createBeer({ style: 'IPA' }),
        createBeer({ style: 'Lager' }),
      ];
      const result = BeerStatsHelper.countByCategory(beers, 'style');
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ style: 'IPA', count: 2 });
      expect(result).toContainEqual({ style: 'Lager', count: 1 });
    });

    it('should count by brewery', () => 
    {
      const beers = [
        createBeer({ brewery: 'A' }),
        createBeer({ brewery: 'A' }),
        createBeer({ brewery: 'B' }),
      ];
      const result = BeerStatsHelper.countByCategory(beers, 'brewery');
      expect(result).toContainEqual({ brewery: 'A', count: 2 });
      expect(result).toContainEqual({ brewery: 'B', count: 1 });
    });
  });

  describe('getStyleCounts', () => 
  {
    it('should return sorted by count descending', () => 
    {
      const beers = [
        createBeer({ style: 'Lager' }),
        createBeer({ style: 'IPA' }),
        createBeer({ style: 'IPA' }),
        createBeer({ style: 'IPA' }),
      ];
      const result = BeerStatsHelper.getStyleCounts(beers);
      expect(result[0]).toEqual({ style: 'IPA', count: 3 });
      expect(result[1]).toEqual({ style: 'Lager', count: 1 });
    });
  });

  describe('getBeersByStyle', () => 
  {
    it('should filter beers by style', () => 
    {
      const beers = [
        createBeer({ style: 'IPA' }),
        createBeer({ style: 'Lager' }),
        createBeer({ style: 'IPA' }),
      ];
      const result = BeerStatsHelper.getBeersByStyle(beers, 'IPA');
      expect(result).toHaveLength(2);
      expect(result.every((b) => b.style === 'IPA')).toBe(true);
    });
  });

  describe('getBeersByBrewery', () => 
  {
    it('should filter beers by brewery', () => 
    {
      const beers = [
        createBeer({ brewery: 'A' }),
        createBeer({ brewery: 'B' }),
        createBeer({ brewery: 'A' }),
      ];
      const result = BeerStatsHelper.getBeersByBrewery(beers, 'A');
      expect(result).toHaveLength(2);
    });
  });

  describe('getHighlyRatedBeers', () => 
  {
    it('should return beers with rating >= minRating', () => 
    {
      const beers = [
        createBeer({ rating: 5 }),
        createBeer({ rating: 3 }),
        createBeer({ rating: 4 }),
      ];
      const result = BeerStatsHelper.getHighlyRatedBeers(beers, 4);
      expect(result).toHaveLength(2);
    });

    it('should use default minRating of 4', () => 
    {
      const beers = [createBeer({ rating: 3 }), createBeer({ rating: 5 })];
      const result = BeerStatsHelper.getHighlyRatedBeers(beers);
      expect(result).toHaveLength(1);
    });
  });

  describe('getDrankPercentage', () => 
  {
    it('should return 0 for empty array', () => 
    {
      expect(BeerStatsHelper.getDrankPercentage([])).toBe(0);
    });

    it('should return correct percentage', () => 
    {
      const beers = [
        createBeer({ drank: true }),
        createBeer({ drank: true }),
        createBeer({ drank: false }),
      ];
      expect(BeerStatsHelper.getDrankPercentage(beers)).toBeCloseTo(66.67);
    });
  });

  describe('getRatedPercentage', () => 
  {
    it('should return 0 for empty array', () => 
    {
      expect(BeerStatsHelper.getRatedPercentage([])).toBe(0);
    });

    it('should return correct percentage', () => 
    {
      const beers = [
        createBeer({ rating: 4 }),
        createBeer({ rating: 5 }),
        createBeer({ rating: undefined }),
      ];
      expect(BeerStatsHelper.getRatedPercentage(beers)).toBeCloseTo(66.67);
    });
  });

  describe('formatRating', () => 
  {
    it('should format with one decimal', () => 
    {
      expect(BeerStatsHelper.formatRating(4.567)).toBe('4.6');
    });
  });

  describe('formatPercentage', () => 
  {
    it('should format with default decimals', () => 
    {
      expect(BeerStatsHelper.formatPercentage(66.7)).toBe('67%');
    });

    it('should format with custom decimals', () => 
    {
      expect(BeerStatsHelper.formatPercentage(66.789, 2)).toBe('66.79%');
    });
  });

  describe('calculateStats', () => 
  {
    it('should return complete stats object', () => 
    {
      const beers = [
        createBeer({ style: 'IPA', brewery: 'A', drank: true, rating: 4 }),
        createBeer({ style: 'IPA', brewery: 'A', drank: false, rating: 5 }),
      ];
      const result = BeerStatsHelper.calculateStats(beers);

      expect(result.totalBeers).toBe(2);
      expect(result.drankBeers).toBe(1);
      expect(result.pendingBeers).toBe(1);
      expect(result.ratedBeers).toBe(2);
      expect(result.averageRating).toBe(4.5);
      expect(result.topStyle).toEqual({ style: 'IPA', count: 2, percentage: 100 });
      expect(result.topBrewery).toEqual({ brewery: 'A', count: 2, percentage: 100 });
    });

    it('should handle empty beer list', () => 
    {
      const result = BeerStatsHelper.calculateStats([]);

      expect(result.totalBeers).toBe(0);
      expect(result.drankBeers).toBe(0);
      expect(result.pendingBeers).toBe(0);
      expect(result.ratedBeers).toBe(0);
      expect(result.averageRating).toBe(0);
    });
  });
});
