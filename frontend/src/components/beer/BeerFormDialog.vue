<template>
  <Dialog :open="open" @close="$emit('close')">
    <div class="mb-4">
      <h3 class="text-lg font-semibold">
        {{ editingBeer ? 'Edit Beer' : 'Add New Beer' }}
      </h3>
      <p class="text-sm text-muted-foreground">
        {{ editingBeer ? 'Update the details of your beer.' : 'Add a new beer to your list.' }}
      </p>
    </div>
    <BeerForm
      :beer="editingBeer"
      @save="$emit('save', $event)"
      @cancel="$emit('close')"
    />
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from '../ui/Dialog.vue'
import BeerForm from './BeerForm.vue'
import type { Beer, BeerInput } from '../../types/BeerInterfaces'

defineProps<{
  open: boolean
  editingBeer?: Beer | undefined
}>()

defineEmits<{
  close: []
  save: [beerData: BeerInput]
}>()
</script>
