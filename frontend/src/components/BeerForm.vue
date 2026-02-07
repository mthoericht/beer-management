<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-2">
      <Label for-id="name">Name *</Label>
      <Input
        id="name"
        name="name"
        v-model="formData.name"
        placeholder="e.g. Helles Lager"
        required
      />
    </div>

    <div class="space-y-2">
      <Label for-id="brewery">Brewery *</Label>
      <Input
        id="brewery"
        name="brewery"
        v-model="formData.brewery"
        placeholder="e.g. Augustiner"
        required
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for-id="style">Style *</Label>
        <Input
          id="style"
          name="style"
          v-model="formData.style"
          placeholder="e.g. IPA"
          required
        />
      </div>

      <div class="space-y-2">
        <Label for-id="abv">ABV (%) *</Label>
        <Input
          id="abv"
          name="abv"
          type="number"
          v-model.number="formData.abv"
          :min="0"
          :max="100"
          :step="0.1"
          placeholder="5.0"
          required
        />
      </div>
    </div>

    <div class="space-y-2">
      <Label>Rating</Label>
      <div class="flex gap-2 items-center">
        <button
          v-for="star in 5"
          :key="star"
          type="button"
          :aria-label="`Rate ${star} star${star > 1 ? 's' : ''}`"
          @click="handleRatingClick(star)"
          @mouseenter="hoveredRating = star"
          @mouseleave="hoveredRating = 0"
          class="focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            :fill="star <= (hoveredRating || formData.rating || 0) ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :class="[
              'transition-colors',
              star <= (hoveredRating || formData.rating || 0)
                ? 'text-amber-400'
                : 'text-gray-300 hover:text-amber-200'
            ]"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
        <Button
          v-if="formData.rating"
          type="button"
          variant="ghost"
          size="sm"
          @click="formData.rating = undefined"
        >
          Reset
        </Button>
      </div>
    </div>

    <div class="space-y-2">
      <Label for-id="notes">Notes</Label>
      <Textarea
        id="notes"
        name="notes"
        v-model="formData.notes"
        :rows="3"
        placeholder="Additional notes about this beer..."
      />
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <Button type="button" variant="outline" @click="$emit('cancel')">
        Cancel
      </Button>
      <Button type="submit">
        {{ beer ? 'Update' : 'Add' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from './ui/Button.vue'
import Input from './ui/Input.vue'
import Label from './ui/Label.vue'
import Textarea from './ui/Textarea.vue'
import { BeerFormProps, BeerInput } from '../types/BeerInterfaces'

const props = defineProps<BeerFormProps>()

const emit = defineEmits<{
  save: [beerData: BeerInput]
  cancel: []
}>()

const hoveredRating = ref(0)

const formData = ref<BeerInput>({
  name: '',
  brewery: '',
  style: '',
  abv: 0,
  rating: undefined,
  notes: undefined,
})

const handleRatingClick = (rating: number) => {
  formData.value.rating = rating
}

watch(() => props.beer, (newBeer: BeerFormProps['beer']) => {
  if (newBeer) {
    formData.value = {
      name: newBeer.name,
      brewery: newBeer.brewery,
      style: newBeer.style,
      abv: newBeer.abv,
      rating: newBeer.rating,
      notes: newBeer.notes,
    }
  } else {
    formData.value = {
      name: '',
      brewery: '',
      style: '',
      abv: 0,
      rating: undefined,
      notes: undefined,
    }
  }
  hoveredRating.value = 0
}, { immediate: true })

const handleSubmit = (): void => {
  if (!formData.value.name || !formData.value.brewery || !formData.value.style) {
    alert('Please fill in all required fields')
    return
  }

  const beerData: BeerInput = {
    ...formData.value,
    abv: parseFloat(formData.value.abv.toString()),
    rating: formData.value.rating ? parseInt(formData.value.rating.toString()) : undefined,
  }

  emit('save', beerData)
}
</script>
