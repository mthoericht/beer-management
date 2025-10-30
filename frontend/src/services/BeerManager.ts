import { ref } from 'vue';
import { apiService } from '../utils/api';
import type { Beer, BeerInput, LoadingState } from '../types/BeerInterfaces';

export class BeerManager 
{
  beers = ref<Beer[]>([]);
  loading = ref<LoadingState>('idle');
  error = ref<string | null>(null);
  showForm = ref(false);
  editingBeer = ref<Beer | undefined>(undefined);

  async fetchBeers(): Promise<void> 
  {
    try 
    {
      this.loading.value = 'loading';
      this.error.value = null;
      const response = await apiService.getBeers();
      if (response.success && response.data) 
      {
        this.beers.value = response.data;
        this.loading.value = 'success';
      }
      else 
      {
        this.error.value = response.error || 'Failed to fetch beers';
        this.loading.value = 'error';
      }
    }
    catch (err) 
    {
      this.error.value = err instanceof Error ? err.message : 'Unknown error';
      this.loading.value = 'error';
    }
  }

  async handleSaveBeer(beerData: BeerInput): Promise<void> 
  {
    try 
    {
      const response = this.editingBeer.value
        ? await apiService.updateBeer(this.editingBeer.value._id, beerData)
        : await apiService.createBeer(beerData);

      if (response.success) 
      {
        await this.fetchBeers();
        this.showForm.value = false;
        this.editingBeer.value = undefined;
      }
      else 
      {
        this.error.value = response.error || 'Failed to save beer';
        const errorMessage = response.message || response.error || 'Failed to save beer';
        alert(errorMessage);
      }
    }
    catch (err) 
    {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      this.error.value = errorMsg;
      alert(errorMsg);
    }
  }

  async handleMarkAsDrank(id: string): Promise<void> 
  {
    try 
    {
      const beer = this.beers.value.find(b => b._id === id);

      if (!beer) return;

      //toggle the drank status and set the dateDrank if the beer is now drank
      const updatedBeer: Partial<Beer> = {
        ...beer,
        drank: !beer.drank,
        ...( !beer.drank ? { dateDrank: new Date().toISOString() } : {} ),
      };

      const response = await apiService.updateBeer(id, updatedBeer);
      if (response.success) 
      {
        await this.fetchBeers();
      }
      else 
      {
        this.error.value = response.error || 'Failed to update beer';
      }
    }
    catch (err) 
    {
      this.error.value = err instanceof Error ? err.message : 'Unknown error';
    }
  }

  async handleDeleteBeer(id: string): Promise<void> 
  {
    if (!confirm('Are you sure you want to delete this beer?')) return;
    try 
    {
      const response = await apiService.deleteBeer(id);
      if (response.success) 
      {
        await this.fetchBeers();
      }
      else 
      {
        this.error.value = response.error || 'Failed to delete beer';
        alert(this.error.value);
      }
    }
    catch (err) 
    {
      this.error.value = err instanceof Error ? err.message : 'Unknown error';
      alert(this.error.value);
    }
  }

  handleEditBeer(beer: Beer): void 
  {
    this.editingBeer.value = beer;
    this.showForm.value = true;
  }

  handleCancelForm(): void 
  {
    this.showForm.value = false;
    this.editingBeer.value = undefined;
  }
}


