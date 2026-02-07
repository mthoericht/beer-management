import type { Beer } from '../types/BeerInterfaces';

export interface BeerStatistics {
  totalBeers: number;
  drankBeers: number;
  pendingBeers: number;
  ratedBeers: number;
  averageRating: number;
  topStyle?: {
    style: string;
    count: number;
    percentage: number;
  };
  topBrewery?: {
    brewery: string;
    count: number;
    percentage: number;
  };
}

export interface CategoryCount {
  style?: string;
  brewery?: string;
  count: number;
}

export class BeerStatsHelper 
{
  /**
   * Calculate all statistics for a list of beers
   */
  static calculateStats(beers: Beer[]): BeerStatistics 
  {
    const totalBeers = beers.length;
    const drankBeers = this.countDrankBeers(beers);
    const pendingBeers = totalBeers - drankBeers;
    const ratedBeers = this.countRatedBeers(beers);
    const averageRating = this.calculateAverageRating(beers);
    const topStyle = this.findTopStyle(beers, totalBeers);
    const topBrewery = this.findTopBrewery(beers, totalBeers);

    return {
      totalBeers,
      drankBeers,
      pendingBeers,
      ratedBeers,
      averageRating,
      ...(topStyle && { topStyle }),
      ...(topBrewery && { topBrewery }),
    };
  }

  /**
   * Count total beers
   */
  static countTotalBeers(beers: Beer[]): number 
  {
    return beers.length;
  }

  /**
   * Count drank beers
   */
  static countDrankBeers(beers: Beer[]): number 
  {
    return beers.filter((beer) => beer.drank).length;
  }

  /**
   * Count pending beers (not yet drank)
   */
  static countPendingBeers(beers: Beer[]): number 
  {
    return beers.filter((beer) => !beer.drank).length;
  }

  /**
   * Count rated beers
   */
  static countRatedBeers(beers: Beer[]): number 
  {
    return beers.filter((beer) => beer.rating != null && beer.rating > 0).length;
  }

  /**
   * Calculate average rating
   */
  static calculateAverageRating(beers: Beer[], decimals: number = 1): number 
  {
    const ratedBeersList = beers.filter((beer) => beer.rating != null && beer.rating > 0);
    
    if (ratedBeersList.length === 0) 
    {
      return 0;
    }

    const sum = ratedBeersList.reduce((total, beer) => total + (beer.rating || 0), 0);
    const average = sum / ratedBeersList.length;
    
    return parseFloat(average.toFixed(decimals));
  }

  /**
   * Calculate average ABV
   */
  static calculateAverageABV(beers: Beer[], decimals: number = 2): number 
  {
    if (beers.length === 0) 
    {
      return 0;
    }

    const sum = beers.reduce((total, beer) => total + beer.abv, 0);
    const average = sum / beers.length;
    
    return parseFloat(average.toFixed(decimals));
  }

  /**
   * Get unique styles
   */
  static getUniqueStyles(beers: Beer[]): string[] 
  {
    return [...new Set(beers.map((beer) => beer.style))];
  }

  /**
   * Get unique breweries
   */
  static getUniqueBreweries(beers: Beer[]): string[] 
  {
    return [...new Set(beers.map((beer) => beer.brewery))];
  }

  /**
   * Find top style by count
   */
  static findTopStyle(beers: Beer[], totalCount: number) 
  {
    if (beers.length === 0) 
    {
      return undefined;
    }

    const styleCounts = this.countByCategory(beers, 'style');
    const topStyle = styleCounts.reduce((top, current) => 
    {
      return current.count > top.count ? current : top;
    }, { style: '', count: 0 });

    if (topStyle.style === '' || !topStyle.style) 
    {
      return undefined;
    }

    return {
      style: topStyle.style,
      count: topStyle.count,
      percentage: (topStyle.count / totalCount) * 100,
    } as { style: string; count: number; percentage: number };
  }

  /**
   * Find top brewery by count
   */
  static findTopBrewery(beers: Beer[], totalCount: number) 
  {
    if (beers.length === 0) 
    {
      return undefined;
    }

    const breweryCounts = this.countByCategory(beers, 'brewery');
    
    const topBrewery = breweryCounts.reduce((top, current) => 
    {
      return current.count > top.count ? current : top;
    }, { brewery: '', count: 0 });

    if (topBrewery.brewery === '' || !topBrewery.brewery) 
    {
      return undefined;
    }

    return {
      brewery: topBrewery.brewery,
      count: topBrewery.count,
      percentage: (topBrewery.count / totalCount) * 100,
    } as { brewery: string; count: number; percentage: number };
  }

  /**
   * Count beers by category (style or brewery)
   */
  static countByCategory(
    beers: Beer[], 
    category: 'style' | 'brewery'
  ): CategoryCount[] 
  {
    const counts = beers.reduce((acc, beer) => 
    {
      const key = beer[category];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([key, count]) => ({
      [category]: key,
      count,
    })) as CategoryCount[];
  }

  /**
   * Get all style counts sorted by popularity
   */
  static getStyleCounts(beers: Beer[]): Array<{ style: string; count: number }> 
  {
    const counts = this.countByCategory(beers, 'style');
    return counts
      .filter((item): item is { style: string; count: number } => item.style !== undefined)
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get all brewery counts sorted by popularity
   */
  static getBreweryCounts(beers: Beer[]): Array<{ brewery: string; count: number }> 
  {
    const counts = this.countByCategory(beers, 'brewery');
    return counts
      .filter((item): item is { brewery: string; count: number } => item.brewery !== undefined)
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get beers by style
   */
  static getBeersByStyle(beers: Beer[], style: string): Beer[] 
  {
    return beers.filter((beer) => beer.style === style);
  }

  /**
   * Get beers by brewery
   */
  static getBeersByBrewery(beers: Beer[], brewery: string): Beer[] 
  {
    return beers.filter((beer) => beer.brewery === brewery);
  }

  /**
   * Get beers with rating
   */
  static getRatedBeers(beers: Beer[]): Beer[] 
  {
    return beers.filter((beer) => beer.rating != null && beer.rating > 0);
  }

  /**
   * Get highly rated beers (rating >= 4)
   */
  static getHighlyRatedBeers(beers: Beer[], minRating: number = 4): Beer[] 
  {
    return beers.filter((beer) => (beer.rating || 0) >= minRating);
  }

  /**
   * Get percentage of drank beers
   */
  static getDrankPercentage(beers: Beer[]): number 
  {
    if (beers.length === 0) 
    {
      return 0;
    }
    return (this.countDrankBeers(beers) / beers.length) * 100;
  }

  /**
   * Get percentage of rated beers
   */
  static getRatedPercentage(beers: Beer[]): number 
  {
    if (beers.length === 0) 
    {
      return 0;
    }
    return (this.countRatedBeers(beers) / beers.length) * 100;
  }

  /**
   * Format rating for display
   */
  static formatRating(rating: number): string 
  {
    return rating.toFixed(1);
  }

  /**
   * Format percentage for display
   */
  static formatPercentage(percentage: number, decimals: number = 0): string 
  {
    return `${percentage.toFixed(decimals)}%`;
  }
}

