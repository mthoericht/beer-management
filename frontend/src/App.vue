<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">🍺 Beer Management</h1>
        <p class="text-gray-600">Track your beer drinking journey</p>
      </header>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <strong>Error:</strong> {{ error }}
      </div>

      <LoadingSpinner v-if="loading === 'loading'" />

      <template v-else>
        <!-- Beer List - Full Width -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-800">Beer List</h2>
            <button
              @click="showForm = true"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Add New Beer
            </button>
          </div>
          
          <BeerList
            :beers="beers"
            @delete="handleDeleteBeer"
            @edit="handleEditBeer"
            @mark-as-drank="handleMarkAsDrank"
          />
        </div>

        <!-- Bottom Section - Stats and Form -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <BeerStats :beers="beers" />
          </div>
          
          <div v-if="showForm" class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">
              {{ editingBeer ? 'Edit Beer' : 'Add New Beer' }}
            </h3>
            <BeerForm
              :beer="editingBeer"
              @save="handleSaveBeer"
              @cancel="handleCancelForm"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BeerList from './components/BeerList.vue'
import BeerForm from './components/BeerForm.vue'
import BeerStats from './components/BeerStats.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { Beer, BeerInput, LoadingState } from './types/BeerInterfaces'
import { apiService } from './utils/api'

const beers = ref<Beer[]>([])
const loading = ref<LoadingState>('idle')
const error = ref<string | null>(null)
const showForm = ref(false)
const editingBeer = ref<Beer | undefined>(undefined)

// Fetch beers from API
const fetchBeers = async (): Promise<void> => {
  try {
    loading.value = 'loading'
    error.value = null
    const response = await apiService.getBeers()
    
    if (response.success && response.data) {
      beers.value = response.data
      loading.value = 'success'
    } else {
      error.value = response.error || 'Failed to fetch beers'
      loading.value = 'error'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
    loading.value = 'error'
  }
}

// Add or update beer
const handleSaveBeer = async (beerData: BeerInput): Promise<void> => 
{
  try 
  {
    const response = editingBeer.value
      ? await apiService.updateBeer(editingBeer.value._id, beerData)
      : await apiService.createBeer(beerData)

    if (response.success) 
    {
      await fetchBeers()
      showForm.value = false;
      editingBeer.value = undefined;
    } else 
    {
      console.log("HALLOOO?? ",response);
      error.value = response.error || 'Failed to save beer';
      const errorMessage = response.message || response.error || 'Failed to save beer';
      alert(errorMessage);
    }
  } catch (err) 
  {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    error.value = errorMsg;
    alert(errorMsg);
  }
}

// Mark beer as drank
const handleMarkAsDrank = async (id: string): Promise<void> => {
  try {
    const beer = beers.value.find(b => b._id === id)
    if (!beer) return

    const updatedBeer = {
      ...beer,
      drank: !beer.drank,
      dateDrank: !beer.drank ? new Date().toISOString() : undefined,
    }

    const response = await apiService.updateBeer(id, updatedBeer)
    
    if (response.success) {
      await fetchBeers()
    } else {
      error.value = response.error || 'Failed to update beer'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  }
}

// Delete beer
const handleDeleteBeer = async (id: string): Promise<void> => {
  if (!confirm('Are you sure you want to delete this beer?')) return
  
  try {
    const response = await apiService.deleteBeer(id)
    
    if (response.success) {
      await fetchBeers()
    } else {
      error.value = response.error || 'Failed to delete beer'
      alert(error.value)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
    alert(error.value)
  }
}

// Edit beer
const handleEditBeer = (beer: Beer): void => {
  editingBeer.value = beer
  showForm.value = true
}

// Cancel form
const handleCancelForm = (): void => {
  showForm.value = false
  editingBeer.value = undefined
}

onMounted(() => {
  fetchBeers()
})
</script>

