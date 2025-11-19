import React from 'react';
import { BeerListProps, Beer } from '../types';

const BeerList: React.FC<BeerListProps> = ({ beers, onDelete, onEdit, onMarkAsDrank }) => 
{
  if (beers.length === 0) 
  {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-6xl mb-4">🍺</div>
        <p className="text-gray-500 text-lg">No beers added yet</p>
        <p className="text-gray-400">Add your first beer to get started!</p>
      </div>
    );
  }

  const formatDate = (dateString: string): string => 
  {
    return new Date(dateString).toLocaleDateString();
  };

  const renderStars = (rating?: number): React.JSX.Element => 
  {
    if (!rating) 
    {
      return <span className="ml-1 text-gray-400">Not rated</span>;
    }
    
    return (
      <span className="ml-1">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {beers.map((beer: Beer) => (
        <div
          key={beer._id}
          className={`border rounded-lg p-4 transition-all duration-200 ${
            beer.drank 
              ? 'bg-gray-50 border-gray-200 opacity-75' 
              : 'bg-white border-gray-200 hover:shadow-md'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {/* if it should be hidden, use "style={{ display: beer.drank ? 'none' : 'block' }}" */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`text-lg font-semibold ${beer.drank ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {beer.name}
                </h3>
                {beer.drank && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Drank
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Brewery:</span> {beer.brewery}
                </div>
                <div>
                  <span className="font-medium">Style:</span> {beer.style}
                </div>
                <div>
                  <span className="font-medium">ABV:</span> {beer.abv}%
                </div>
                <div>
                  <span className="font-medium">Rating:</span> 
                  {renderStars(beer.rating)}
                </div>
              </div>
              
              {beer.notes && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Notes:</span> {beer.notes}
                </div>
              )}
              
              <div className="mt-2 text-xs text-gray-400">
                Added: {formatDate(beer.dateAdded)}
                {beer.dateDrank && (
                  <span className="ml-4">
                    Drank: {formatDate(beer.dateDrank)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => onMarkAsDrank(beer._id)}
                className={`px-3 py-1 text-xs font-medium rounded transition duration-200 ${
                  beer.drank
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {beer.drank ? 'Mark as Not Drank' : 'Mark as Drank'}
              </button>
              
              <button
                onClick={() => onEdit(beer)}
                className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition duration-200"
              >
                Edit
              </button>
              
              <button
                onClick={() => onDelete(beer._id)}
                className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded hover:bg-red-200 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BeerList;
