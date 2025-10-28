<template>
  <div v-if="beers.length === 0" class="text-center py-8">
    <div class="text-gray-400 text-6xl mb-4">🍺</div>
    <p class="text-gray-500 text-lg">No beers added yet</p>
    <p class="text-gray-400">Add your first beer to get started!</p>
  </div>

  <div v-else class="space-y-4">
    <div
      v-for="beer in beers"
      :key="beer._id"
      :class="[
        'border rounded-lg p-4 transition-all duration-200',
        beer.drank 
          ? 'bg-gray-50 border-gray-200 opacity-75' 
          : 'bg-white border-gray-200 hover:shadow-md'
      ]"
    >
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <h3 :class="[
              'text-lg font-semibold',
              beer.drank ? 'line-through text-gray-500' : 'text-gray-800'
            ]">
              {{ beer.name }}
            </h3>
            <span v-if="beer.drank" class="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Drank
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span class="font-medium">Brewery:</span> {{ beer.brewery }}
            </div>
            <div>
              <span class="font-medium">Style:</span> {{ beer.style }}
            </div>
            <div>
              <span class="font-medium">ABV:</span> {{ beer.abv }}%
            </div>
            <div>
              <span class="font-medium">Rating:</span> 
              <span v-if="beer.rating" class="ml-1">
                {{ '★'.repeat(beer.rating) }}{{ '☆'.repeat(5 - beer.rating) }}
              </span>
              <span v-else class="ml-1 text-gray-400">Not rated</span>
            </div>
          </div>
          
          <div v-if="beer.notes" class="mt-2 text-sm text-gray-600">
            <span class="font-medium">Notes:</span> {{ beer.notes }}
          </div>
          
          <div class="mt-2 text-xs text-gray-400">
            Added: {{ formatDate(beer.dateAdded) }}
            <span v-if="beer.dateDrank" class="ml-4">
              Drank: {{ formatDate(beer.dateDrank) }}
            </span>
          </div>
        </div>
        
        <div class="flex flex-col gap-2 ml-4">
          <button
            @click="$emit('mark-as-drank', beer._id)"
            :class="[
              'px-3 py-1 text-xs font-medium rounded transition duration-200',
              beer.drank
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            ]"
          >
            {{ beer.drank ? 'Mark as Not Drank' : 'Mark as Drank' }}
          </button>
          
          <button
            @click="$emit('edit', beer)"
            class="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition duration-200"
          >
            Edit
          </button>
          
          <button
            @click="$emit('delete', beer._id)"
            class="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded hover:bg-red-200 transition duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BeerListProps } from '../types'

defineProps<BeerListProps>()

defineEmits<{
  delete: [id: string]
  edit: [beer: import('../types').Beer]
  'mark-as-drank': [id: string]
}>()

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}
</script>

