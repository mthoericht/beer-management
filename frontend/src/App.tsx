import React, { useState, useEffect } from 'react';
import BeerList from './components/BeerList';
import BeerForm from './components/BeerForm';
import BeerStats from './components/BeerStats';
import { Beer, BeerInput, AppState } from './types';
import { apiService } from './utils/api';

const App: React.FC = () => 
{
  const [state, setState] = useState<AppState>({
    beers: [],
    loading: 'idle',
    error: null,
    showForm: false,
    editingBeer: undefined,
  });

  // Fetch beers from API
  const fetchBeers = async (): Promise<void> => 
  {
    try 
    {
      setState(prev => ({ ...prev, loading: 'loading', error: null }));
      const response = await apiService.getBeers();
      
      if (response.success && response.data) 
      {
        setState(prev => ({ 
          ...prev, 
          beers: response.data!, 
          loading: 'success' 
        }));
      }
      else 
      {
        setState(prev => ({ 
          ...prev, 
          error: response.error || 'Failed to fetch beers',
          loading: 'error'
        }));
      }
    }
    catch (error) 
    {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: 'error'
      }));
    }
  };

  // Add or update beer
  const handleSaveBeer = async (beerData: BeerInput): Promise<void> => 
  {
    try 
    {
      const response = state.editingBeer
        ? await apiService.updateBeer(state.editingBeer._id, beerData)
        : await apiService.createBeer(beerData);

      if (response.success) 
      {
        await fetchBeers();
        setState(prev => ({ 
          ...prev, 
          showForm: false, 
          editingBeer: undefined 
        }));
      }
      else 
      {
        setState(prev => ({ 
          ...prev, 
          error: response.error || 'Failed to save beer' 
        }));
      }
    }
    catch (error) 
    {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  };

  // Delete beer
  const handleDeleteBeer = async (id: string): Promise<void> => 
  {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this beer?')) 
    {
      return;
    }
    
    try 
    {
      const response = await apiService.deleteBeer(id);
      
      if (response.success) 
      {
        await fetchBeers();
      }
      else 
      {
        setState(prev => ({ 
          ...prev, 
          error: response.error || 'Failed to delete beer' 
        }));
      }
    }
    catch (error) 
    {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  };

  // Mark beer as drank
  const handleMarkAsDrank = async (id: string): Promise<void> => 
  {
    try 
    {
      const beer = state.beers.find(b => b._id === id);
      if (!beer) return;

      const updatedBeer = {
        ...beer,
        drank: !beer.drank,
        dateDrank: !beer.drank ? new Date().toISOString() : undefined,
      };

      const response = await apiService.updateBeer(id, updatedBeer);
      
      if (response.success) 
      {
        await fetchBeers();
      }
      else 
      {
        setState(prev => ({ 
          ...prev, 
          error: response.error || 'Failed to update beer' 
        }));
      }
    }
    catch (error) 
    {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  };

  // Edit beer
  const handleEditBeer = (beer: Beer): void => 
  {
    setState(prev => ({ 
      ...prev, 
      editingBeer: beer, 
      showForm: true 
    }));
  };

  // Cancel form
  const handleCancelForm = (): void => 
  {
    setState(prev => ({ 
      ...prev, 
      showForm: false, 
      editingBeer: undefined 
    }));
  };

  useEffect(() => 
  {
    fetchBeers();
  }, []);

  if (state.loading === 'loading') 
  {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading beers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🍺 Beer Management</h1>
          <p className="text-gray-600">Track your beer drinking journey</p>
        </header>

        {state.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {state.error}
          </div>
        )}

        {/* Beer List - Full Width */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Beer List</h2>
            <button
              onClick={() => setState(prev => ({ ...prev, showForm: true }))}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Add New Beer
            </button>
          </div>
          
          <BeerList
            beers={state.beers}
            onDelete={handleDeleteBeer}
            onEdit={handleEditBeer}
            onMarkAsDrank={handleMarkAsDrank}
          />
        </div>

        {/* Bottom Section - Stats and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <BeerStats beers={state.beers} />
          </div>
          
          {state.showForm && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {state.editingBeer ? 'Edit Beer' : 'Add New Beer'}
              </h3>
              <BeerForm
                beer={state.editingBeer}
                onSave={handleSaveBeer}
                onCancel={handleCancelForm}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
