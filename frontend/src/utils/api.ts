import { Beer, BeerInput, BeerUpdate, ApiResponse, BeerStats } from '../types';

const API_BASE_URL = 'http://localhost:5001/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Beer API methods
  async getBeers(): Promise<ApiResponse<Beer[]>> 
  {
    return this.request<Beer[]>('/beers');
  }

  async getBeer(id: string): Promise<ApiResponse<Beer>> 
  {
    return this.request<Beer>(`/beers/${id}`);
  }

  async createBeer(beerData: BeerInput): Promise<ApiResponse<Beer>> 
  {
    return this.request<Beer>('/beers', {
      method: 'POST',
      body: JSON.stringify(beerData),
    });
  }

  async updateBeer(id: string, beerData: BeerUpdate): Promise<ApiResponse<Beer>> 
  {
    return this.request<Beer>(`/beers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(beerData),
    });
  }

  async deleteBeer(id: string): Promise<ApiResponse<void>> 
  {
    return this.request<void>(`/beers/${id}`, {
      method: 'DELETE',
    });
  }

  async getBeerStats(): Promise<ApiResponse<BeerStats>> 
  {
    return this.request<BeerStats>('/beers/stats');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> 
  {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
