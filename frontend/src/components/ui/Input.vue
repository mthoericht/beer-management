<script lang="ts">
export default { inheritAttrs: false }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { fieldBase } from '../../utils/fieldClasses'

const props = defineProps<{
  modelValue: string | number
  type?: string
  placeholder?: string
  id?: string
  name?: string
  min?: number
  max?: number
  step?: number
  required?: boolean
}>()

const inputType = computed(() => props.type || 'text')

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = inputType.value === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const attrs = useAttrs()
const extraClass = computed(() => (attrs.class as string) || '')
</script>

<template>
  <input
    :id="id"
    :name="name"
    :type="inputType"
    :placeholder="placeholder"
    :min="min"
    :max="max"
    :step="step"
    :required="required"
    :value="modelValue"
    @input="handleInput"
    :class="[fieldBase, extraClass]"
  />
</template>
