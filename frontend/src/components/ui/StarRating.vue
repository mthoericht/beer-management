<template>
  <div class="flex gap-1 items-center">
    <template v-if="interactive">
      <button
        v-for="star in maxStars"
        :key="star"
        type="button"
        :aria-label="`Rate ${star} star${star > 1 ? 's' : ''}`"
        @click="handleClick(star)"
        @mouseenter="hoveredRating = star"
        @mouseleave="hoveredRating = 0"
        class="focus:outline-none"
      >
        <StarIcon
          :size="starSize ?? 32"
          :filled="star <= (hoveredRating || modelValue || 0)"
          :icon-class="[
            'transition-colors',
            star <= (hoveredRating || modelValue || 0)
              ? 'text-amber-400'
              : 'text-gray-300 hover:text-amber-200'
          ].join(' ')"
        />
      </button>
      <Button
        v-if="modelValue"
        type="button"
        variant="ghost"
        size="sm"
        @click="emit('update:modelValue', undefined)"
      >
        Reset
      </Button>
    </template>
    <template v-else>
      <StarIcon
        v-for="star in maxStars"
        :key="star"
        :size="starSize ?? 32"
        :filled="star <= (modelValue || 0)"
        :icon-class="star <= (modelValue || 0) ? 'text-amber-400' : 'text-gray-300'"
        :aria-label="`${star} star${star > 1 ? 's' : ''}`"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StarIcon from '../icons/StarIcon.vue'
import Button from './Button.vue'

withDefaults(
  defineProps<{
    modelValue?: number | undefined
    interactive?: boolean
    maxStars?: number
    starSize?: number
  }>(),
  { modelValue: 0, interactive: false, maxStars: 5, starSize: 32 }
)

const emit = defineEmits<{ 'update:modelValue': [value: number | undefined] }>()

const hoveredRating = ref(0)

const handleClick = (rating: number) => {
  emit('update:modelValue', rating)
}
</script>
