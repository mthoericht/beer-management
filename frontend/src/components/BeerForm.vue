<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
        Beer Name *
      </label>
      <input
        type="text"
        id="name"
        name="name"
        v-model="formData.name"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="e.g., IPA"
        required
      />
    </div>

    <div>
      <label for="brewery" class="block text-sm font-medium text-gray-700 mb-1">
        Brewery *
      </label>
      <input
        type="text"
        id="brewery"
        name="brewery"
        v-model="formData.brewery"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="e.g., Sierra Nevada"
        required
      />
    </div>

    <div>
      <label for="style" class="block text-sm font-medium text-gray-700 mb-1">
        Style *
      </label>
      <input
        type="text"
        id="style"
        name="style"
        v-model="formData.style"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="e.g., India Pale Ale"
        required
      />
    </div>

    <div>
      <label for="abv" class="block text-sm font-medium text-gray-700 mb-1">
        ABV (%) *
      </label>
      <input
        type="number"
        id="abv"
        name="abv"
        v-model.number="formData.abv"
        min="0"
        max="100"
        step="0.1"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="e.g., 6.5"
        required
      />
    </div>

    <div>
      <label for="rating" class="block text-sm font-medium text-gray-700 mb-1">
        Rating (1-5)
      </label>
      <select
        id="rating"
        name="rating"
        v-model.number="formData.rating"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option :value="undefined">Not rated</option>
        <option :value="1">1 ⭐</option>
        <option :value="2">2 ⭐⭐</option>
        <option :value="3">3 ⭐⭐⭐</option>
        <option :value="4">4 ⭐⭐⭐⭐</option>
        <option :value="5">5 ⭐⭐⭐⭐⭐</option>
      </select>
    </div>

    <div>
      <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
        Notes
      </label>
      <textarea
        id="notes"
        name="notes"
        v-model="formData.notes"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Tasting notes, thoughts, etc."
      />
    </div>

    <div class="flex items-center">
      <input
        type="checkbox"
        id="drank"
        name="drank"
        v-model="formData.drank"
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label for="drank" class="ml-2 block text-sm text-gray-700">
        Already drank this beer
      </label>
    </div>

    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
      >
        {{ beer ? 'Update Beer' : 'Add Beer' }}
      </button>
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-200"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { BeerFormProps, BeerInput } from '../types'

const props = defineProps<BeerFormProps>()

const emit = defineEmits<{
  save: [beerData: BeerInput]
  cancel: []
}>()

const formData = ref<BeerInput>({
  name: '',
  brewery: '',
  style: '',
  abv: 0,
  rating: undefined,
  notes: undefined,
  drank: false,
})

watch(() => props.beer, (newBeer: BeerFormProps['beer']) => {
  if (newBeer) {
    formData.value = {
      name: newBeer.name,
      brewery: newBeer.brewery,
      style: newBeer.style,
      abv: newBeer.abv,
      rating: newBeer.rating,
      notes: newBeer.notes,
      drank: newBeer.drank,
    }
  }
}, { immediate: true })

const handleSubmit = (): void => {
  // Validate required fields
  if (!formData.value.name || !formData.value.brewery || !formData.value.style || formData.value.abv <= 0) {
    alert('Please fill in all required fields')
    return
  }

  // Convert numeric fields
  const beerData: BeerInput = {
    ...formData.value,
    abv: parseFloat(formData.value.abv.toString()),
    rating: formData.value.rating ? parseInt(formData.value.rating.toString()) : undefined,
  }

  emit('save', beerData)
}
</script>

