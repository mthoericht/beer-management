import React, { useState, useEffect } from 'react';
import { BeerFormProps, BeerInput } from '../types';

const BeerForm: React.FC<BeerFormProps> = ({ beer, onSave, onCancel }) => 
{
  const [formData, setFormData] = useState<BeerInput>({
    name: '',
    brewery: '',
    style: '',
    abv: 0,
    rating: undefined,
    notes: undefined,
    drank: false,
  });

  useEffect(() => 
  {
    if (beer) 
    {
      setFormData({
        name: beer.name,
        brewery: beer.brewery,
        style: beer.style,
        abv: beer.abv,
        rating: beer.rating,
        notes: beer.notes,
        drank: beer.drank,
      });
    }
  }, [beer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => 
  {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
        type === 'number' ? parseFloat(value) || 0 : 
          value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => 
  {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.brewery || !formData.style || formData.abv <= 0) 
    {
      alert('Please fill in all required fields');
      return;
    }

    // Convert numeric fields
    const beerData: BeerInput = {
      ...formData,
      abv: parseFloat(formData.abv.toString()),
      rating: formData.rating ? parseInt(formData.rating.toString()) : undefined,
    };

    onSave(beerData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Beer Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., IPA"
          required
        />
      </div>

      <div>
        <label htmlFor="brewery" className="block text-sm font-medium text-gray-700 mb-1">
          Brewery *
        </label>
        <input
          type="text"
          id="brewery"
          name="brewery"
          value={formData.brewery}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Sierra Nevada"
          required
        />
      </div>

      <div>
        <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
          Style *
        </label>
        <input
          type="text"
          id="style"
          name="style"
          value={formData.style}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., India Pale Ale"
          required
        />
      </div>

      <div>
        <label htmlFor="abv" className="block text-sm font-medium text-gray-700 mb-1">
          ABV (%) *
        </label>
        <input
          type="number"
          id="abv"
          name="abv"
          value={formData.abv}
          onChange={handleChange}
          min="0"
          max="100"
          step="0.1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 6.5"
          required
        />
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
          Rating (1-5)
        </label>
        <select
          id="rating"
          name="rating"
          value={formData.rating || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Not rated</option>
          <option value="1">1 ⭐</option>
          <option value="2">2 ⭐⭐</option>
          <option value="3">3 ⭐⭐⭐</option>
          <option value="4">4 ⭐⭐⭐⭐</option>
          <option value="5">5 ⭐⭐⭐⭐⭐</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tasting notes, thoughts, etc."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="drank"
          name="drank"
          checked={formData.drank}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="drank" className="ml-2 block text-sm text-gray-700">
          Already drank this beer
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          {beer ? 'Update Beer' : 'Add Beer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BeerForm;
