<script lang="ts">
export default { inheritAttrs: false }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { fieldBase } from '../../utils/fieldClasses'

defineProps<{
  modelValue: string | number | undefined
  id?: string
  name?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const raw = target.value
  const parsed = raw === '' ? undefined : isNaN(Number(raw)) ? raw : Number(raw)
  emit('update:modelValue', parsed)
}

const attrs = useAttrs()
const extraClass = computed(() => (attrs.class as string) || '')
</script>

<template>
  <select
    :id="id"
    :name="name"
    :value="modelValue"
    @change="handleChange"
    :class="[fieldBase, extraClass]"
  >
    <slot />
  </select>
</template>
