<template>
  <EmptyState
    v-if="beers.length === 0"
    title="No beers found"
    message="Add your first beer!"
  />

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <BeerCard
      v-for="beer in beers"
      :key="beer._id"
      :beer="beer"
      @delete="$emit('delete', $event)"
      @edit="$emit('edit', $event)"
      @mark-as-drank="$emit('mark-as-drank', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import BeerCard from './BeerCard.vue'
import EmptyState from '../ui/EmptyState.vue'
import { BeerListProps } from '../../types/BeerInterfaces'

defineProps<BeerListProps>()

defineEmits<{
  delete: [id: string]
  edit: [beer: import('../../types/BeerInterfaces').Beer]
  'mark-as-drank': [id: string]
}>()
</script>
