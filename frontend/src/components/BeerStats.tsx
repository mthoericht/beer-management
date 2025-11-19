import React from 'react';
import { BeerStatsProps } from '../types';

const BeerStats: React.FC<BeerStatsProps> = ({ beers }) => 
{
  const totalBeers = beers.length;
  const drankBeers = beers.filter(beer => beer.drank).length;
  const pendingBeers = totalBeers - drankBeers;
  const ratedBeers = beers.filter(beer => beer.rating).length;
  const averageRating = ratedBeers > 0 
    ? (beers.reduce((sum, beer) => sum + (beer.rating || 0), 0) / ratedBeers).toFixed(1)
    : '0';

  const styles = [...new Set(beers.map(beer => beer.style))];
  const breweries = [...new Set(beers.map(beer => beer.brewery))];

  const topStyle = styles.reduce((top, style) => 
  {
    const count = beers.filter(beer => beer.style === style).length;
    return count > (top.count || 0) ? { style, count } : top;
  }, {} as { style: string; count: number });

  const topBrewery = breweries.reduce((top, brewery) => 
  {
    const count = beers.filter(beer => beer.brewery === brewery).length;
    return count > (top.count || 0) ? { brewery, count } : top;
  }, {} as { brewery: string; count: number });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Statistics</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalBeers}</div>
            <div className="text-sm text-gray-600">Total Beers</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{drankBeers}</div>
            <div className="text-sm text-gray-600">Drank</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{pendingBeers}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{averageRating}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>

        {totalBeers > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3">Top Categories</h4>
            
            {topStyle.style && (
              <div className="mb-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Style:</span>
                  <span className="font-medium">{topStyle.style}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(topStyle.count / totalBeers) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {topBrewery.brewery && (
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Brewery:</span>
                  <span className="font-medium">{topBrewery.brewery}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(topBrewery.count / totalBeers) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {totalBeers === 0 && (
          <div className="text-center py-4 text-gray-500">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-sm">Add some beers to see statistics!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeerStats;
