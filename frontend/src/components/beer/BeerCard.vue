<template>
  <Card :class="beer.drank ? 'opacity-75 bg-muted/50' : ''">
    <div class="px-6 pt-6 pb-3">
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <BeerIcon size="20" icon-class="text-amber-600 flex-shrink-0" />
            <h3 class="font-semibold text-lg truncate">{{ beer.name }}</h3>
          </div>
          <p class="text-sm text-muted-foreground truncate">{{ beer.brewery }}</p>
        </div>
        <Badge v-if="beer.drank" variant="secondary" class="flex-shrink-0">
          Drank
        </Badge>
      </div>
    </div>

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
        <StarRating :model-value="beer.rating" :star-size="16" />
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
</template>

<script setup lang="ts">
import Card from '../ui/Card.vue'
import Badge from '../ui/Badge.vue'
import Button from '../ui/Button.vue'
import BeerIcon from '../icons/BeerIcon.vue'
import StarRating from '../ui/StarRating.vue'
import type { Beer } from '../../types/BeerInterfaces'

defineProps<{ beer: Beer }>()

defineEmits<{
  delete: [id: string]
  edit: [beer: Beer]
  'mark-as-drank': [id: string]
}>()

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US')
}
</script>
