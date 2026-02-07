<template>
  <div v-if="beers.length === 0" class="text-center py-12">
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground mx-auto mb-4"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 3 11 3s2 .5 3 .5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/></svg>
    <h3 class="text-xl font-semibold mb-2">No beers found</h3>
    <p class="text-muted-foreground mb-4">Add your first beer!</p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <Card
      v-for="beer in beers"
      :key="beer._id"
      :class="beer.drank ? 'opacity-75 bg-muted/50' : ''"
    >
      <!-- Header -->
      <div class="px-6 pt-6 pb-3">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600 flex-shrink-0"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 3 11 3s2 .5 3 .5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/></svg>
              <h3 class="font-semibold text-lg truncate">{{ beer.name }}</h3>
            </div>
            <p class="text-sm text-muted-foreground truncate">{{ beer.brewery }}</p>
          </div>
          <Badge v-if="beer.drank" variant="secondary" class="flex-shrink-0">
            Drank
          </Badge>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 pb-3 space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">Style:</span>
          <span class="font-medium">{{ beer.style }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">ABV:</span>
          <span class="font-medium">{{ beer.abv }}%</span>
        </div>
        <div v-if="beer.rating" class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">Rating:</span>
          <div class="flex gap-1">
            <svg
              v-for="star in 5"
              :key="star"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              :fill="star <= beer.rating! ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              :class="star <= beer.rating! ? 'text-amber-400' : 'text-gray-300'"
              :aria-label="`Rate ${star} star${star > 1 ? 's' : ''}`"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        </div>

        <div v-if="beer.notes" class="text-sm pt-2 border-t border-border">
          <p class="text-muted-foreground mb-1">Notes:</p>
          <p class="text-sm">{{ beer.notes }}</p>
        </div>

        <div class="text-xs text-muted-foreground pt-2">
          Added: {{ formatDate(beer.dateAdded) }}
          <span v-if="beer.dateDrank"> · Drank: {{ formatDate(beer.dateDrank) }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-2 px-6 pb-6 pt-3 border-t border-border">
        <Button
          @click="$emit('mark-as-drank', beer._id)"
          size="sm"
          :variant="beer.drank ? 'outline' : 'default'"
          class="flex-1"
          :class="beer.drank ? 'opacity-50' : ''"
        >
          {{ beer.drank ? 'Unmark as Drank' : 'Mark as Drank' }}
        </Button>
        <Button size="sm" variant="outline" aria-label="Edit" @click="$emit('edit', beer)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
        </Button>
        <Button size="sm" variant="outline" aria-label="Delete" @click="$emit('delete', beer._id)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </Button>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Button from './ui/Button.vue'
import Card from './ui/Card.vue'
import Badge from './ui/Badge.vue'
import { BeerListProps } from '../types/BeerInterfaces'

defineProps<BeerListProps>()

defineEmits<{
  delete: [id: string]
  edit: [beer: import('../types/BeerInterfaces').Beer]
  'mark-as-drank': [id: string]
}>()

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US')
}
</script>
