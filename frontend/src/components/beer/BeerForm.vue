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
      <StarRating v-model="formData.rating" :interactive="true" />
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
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import Label from '../ui/Label.vue'
import Textarea from '../ui/Textarea.vue'
import StarRating from '../ui/StarRating.vue'
import { BeerFormProps, BeerInput } from '../../types/BeerInterfaces'

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
