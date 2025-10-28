<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">📊 Statistics</h3>
    
    <div v-if="totalBeers === 0" class="text-center py-4 text-gray-500">
      <div class="text-4xl mb-2">📈</div>
      <p class="text-sm">Add some beers to see statistics!</p>
    </div>

    <div v-else class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center p-3 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ totalBeers }}</div>
          <div class="text-sm text-gray-600">Total Beers</div>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600">{{ drankBeers }}</div>
          <div class="text-sm text-gray-600">Drank</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="text-center p-3 bg-yellow-50 rounded-lg">
          <div class="text-2xl font-bold text-yellow-600">{{ pendingBeers }}</div>
          <div class="text-sm text-gray-600">Pending</div>
        </div>
        <div class="text-center p-3 bg-purple-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">{{ averageRating }}</div>
          <div class="text-sm text-gray-600">Avg Rating</div>
        </div>
      </div>

      <div v-if="totalBeers > 0" class="pt-4 border-t border-gray-200">
        <h4 class="font-medium text-gray-700 mb-3">Top Categories</h4>
        
        <div v-if="topStyle && topStyle.style" class="mb-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Style:</span>
            <span class="font-medium">{{ topStyle.style }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              class="bg-blue-600 h-2 rounded-full" 
              :style="{ width: `${topStyle.percentage}%` }"
            ></div>
          </div>
        </div>

        <div v-if="topBrewery && topBrewery.brewery">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Brewery:</span>
            <span class="font-medium">{{ topBrewery.brewery }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              class="bg-green-600 h-2 rounded-full" 
              :style="{ width: `${topBrewery.percentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BeerStatsProps } from '../types/BeerInterfaces'
import { BeerStatsHelper } from '../utils/beerStatsHelper'

const props = defineProps<BeerStatsProps>()

// Use the helper class for all calculations
const stats = computed(() => BeerStatsHelper.calculateStats(props.beers))

const totalBeers = computed(() => stats.value.totalBeers)
const drankBeers = computed(() => stats.value.drankBeers)
const pendingBeers = computed(() => stats.value.pendingBeers)
const averageRating = computed(() => stats.value.averageRating.toString())
const topStyle = computed(() => stats.value.topStyle)
const topBrewery = computed(() => stats.value.topBrewery)
</script>

