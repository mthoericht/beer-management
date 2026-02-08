<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">Statistics</h2>

    <EmptyState
      v-if="totalBeers === 0"
      title="No beers found"
      message="Add some beers to see statistics!"
    />

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total"
          :value="totalBeers"
          subtitle="Beers in list"
        >
          <template #icon>
            <BeerIcon size="16" />
          </template>
        </StatCard>

        <StatCard
          label="Drank"
          :value="drankBeers"
          :subtitle="totalBeers > 0 ? `${Math.round((drankBeers / totalBeers) * 100)}% of list` : '0% of list'"
          value-class="text-green-600"
        >
          <template #icon>
            <BeerIcon size="16" />
          </template>
        </StatCard>

        <StatCard
          label="To Try"
          :value="toTryBeers"
          subtitle="Beers on wishlist"
          value-class="text-blue-600"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </template>
        </StatCard>

        <StatCard
          label="Average"
          :value="averageRating"
          :subtitle="`⭐ of ${ratedBeers} rated`"
          value-class="text-amber-600"
        >
          <template #icon>
            <StarIcon size="16" filled />
          </template>
        </StatCard>
      </div>

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
              <BeerIcon size="16" />
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
                  <StarIcon size="12" filled icon-class="text-amber-400" />
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
import Card from '../ui/Card.vue'
import BeerIcon from '../icons/BeerIcon.vue'
import StarIcon from '../icons/StarIcon.vue'
import StatCard from '../ui/StatCard.vue'
import EmptyState from '../ui/EmptyState.vue'
import { BeerStatsProps } from '../../types/BeerInterfaces'
import { BeerStatsHelper } from '../../utils/beerStatsHelper'

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
