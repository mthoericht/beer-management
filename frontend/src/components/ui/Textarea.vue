<script setup lang="ts">
import { fieldBase } from '../../utils/fieldClasses'

defineProps<{
  modelValue: string | undefined
  id?: string
  name?: string
  rows?: number
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <textarea
    :id="id"
    :name="name"
    :rows="rows"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :class="fieldBase"
  />
</template>
