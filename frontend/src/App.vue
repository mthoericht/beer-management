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
import { onMounted } from 'vue'
import BeerList from './components/BeerList.vue'
import BeerForm from './components/BeerForm.vue'
import BeerStats from './components/BeerStats.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { BeerManager } from './services/BeerManager'

const manager = new BeerManager()

const beers = manager.beers
const loading = manager.loading
const error = manager.error
const showForm = manager.showForm
const editingBeer = manager.editingBeer

const fetchBeers = () => manager.fetchBeers()
const handleSaveBeer = (beerData: any) => manager.handleSaveBeer(beerData)
const handleMarkAsDrank = (id: string) => manager.handleMarkAsDrank(id)
const handleDeleteBeer = (id: string) => manager.handleDeleteBeer(id)
const handleEditBeer = (beer: any) => manager.handleEditBeer(beer)
const handleCancelForm = () => manager.handleCancelForm()

onMounted(() => {
  fetchBeers()
})
</script>

