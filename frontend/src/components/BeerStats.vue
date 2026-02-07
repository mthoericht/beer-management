<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">Statistics</h2>

    <div v-if="totalBeers === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground mx-auto mb-4"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 3 11 3s2 .5 3 .5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/></svg>
      <h3 class="text-xl font-semibold mb-2">No beers found</h3>
      <p class="text-muted-foreground">Add some beers to see statistics!</p>
    </div>

    <template v-else>
      <!-- Stat Cards Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div class="px-6 pt-6 pb-2">
            <div class="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 3 11 3s2 .5 3 .5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/></svg>
              Total
            </div>
          </div>
          <div class="px-6 pb-6">
            <div class="text-3xl font-bold">{{ totalBeers }}</div>
            <p class="text-xs text-muted-foreground mt-1">Beers in list</p>
          </div>
        </Card>

        <Card>
          <div class="px-6 pt-6 pb-2">
            <div class="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 3 11 3s2 .5 3 .5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/></svg>
              Drank
            </div>
          </div>
          <div class="px-6 pb-6">
            <div class="text-3xl font-bold text-green-600">{{ drankBeers }}</div>
            <p class="text-xs text-muted-foreground mt-1">
              {{ totalBeers > 0 ? `${Math.round((drankBeers / totalBeers) * 100)}% of list` : '0% of list' }}
            </p>
          </div>
        </Card>

        <Card>
          <div class="px-6 pt-6 pb-2">
            <div class="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              To Try
            </div>
          </div>
          <div class="px-6 pb-6">
            <div class="text-3xl font-bold text-blue-600">{{ toTryBeers }}</div>
            <p class="text-xs text-muted-foreground mt-1">Beers on wishlist</p>
          </div>
        </Card>

        <Card>
          <div class="px-6 pt-6 pb-2">
            <div class="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Average
            </div>
          </div>
          <div class="px-6 pb-6">
            <div class="text-3xl font-bold text-amber-600">{{ averageRating }}</div>
            <p class="text-xs text-muted-foreground mt-1">⭐ of {{ ratedBeers }} rated</p>
          </div>
        </Card>
      </div>

      <!-- Detail Cards Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div class="px-6 pt-6">
            <div class="text-base font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              Top Styles
            </div>
          </div>
          <div class="px-6 pb-6">
            <ul v-if="topStyles.length > 0" class="space-y-2">
              <li v-for="item in topStyles" :key="item.style" class="flex justify-between items-center">
                <span class="text-sm font-medium truncate">{{ item.style }}</span>
                <span class="text-sm text-muted-foreground ml-2">{{ item.count }} beer{{ item.count !== 1 ? 's' : '' }}</span>
              </li>
            </ul>
            <p v-else class="text-sm text-muted-foreground">No data yet</p>
          </div>
        </Card>

        <Card>
          <div class="px-6 pt-6">
            <div class="text-base font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 3 11 3s2 .5 3 .5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/></svg>
              Top Breweries
            </div>
          </div>
          <div class="px-6 pb-6">
            <ul v-if="topBreweries.length > 0" class="space-y-2">
              <li v-for="item in topBreweries" :key="item.brewery" class="flex justify-between items-center">
                <span class="text-sm font-medium truncate">{{ item.brewery }}</span>
                <span class="text-sm text-muted-foreground ml-2">{{ item.count }} beer{{ item.count !== 1 ? 's' : '' }}</span>
              </li>
            </ul>
            <p v-else class="text-sm text-muted-foreground">No data yet</p>
          </div>
        </Card>

        <Card>
          <div class="px-6 pt-6">
            <div class="text-base font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
              Highest Rated
            </div>
          </div>
          <div class="px-6 pb-6">
            <ul v-if="highestRated.length > 0" class="space-y-2">
              <li v-for="beer in highestRated" :key="beer._id" class="flex justify-between items-center">
                <span class="text-sm font-medium truncate">{{ beer.name }}</span>
                <div class="flex items-center gap-1 ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span class="text-sm text-muted-foreground">{{ beer.rating }}</span>
                </div>
              </li>
            </ul>
            <p v-else class="text-sm text-muted-foreground">No ratings yet</p>
          </div>
        </Card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Card from './ui/Card.vue'
import { BeerStatsProps } from '../types/BeerInterfaces'
import { BeerStatsHelper } from '../utils/beerStatsHelper'

const props = defineProps<BeerStatsProps>()

const stats = computed(() => BeerStatsHelper.calculateStats(props.beers))

const totalBeers = computed(() => stats.value.totalBeers)
const drankBeers = computed(() => stats.value.drankBeers)
const toTryBeers = computed(() => stats.value.pendingBeers)
const ratedBeers = computed(() => stats.value.ratedBeers)
const averageRating = computed(() => stats.value.averageRating.toFixed(1))

const topStyles = computed(() => BeerStatsHelper.getStyleCounts(props.beers).slice(0, 3))
const topBreweries = computed(() => BeerStatsHelper.getBreweryCounts(props.beers).slice(0, 3))
const highestRated = computed(() =>
  [...props.beers]
    .filter(b => b.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3)
)
</script>
